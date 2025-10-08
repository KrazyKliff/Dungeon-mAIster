import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, UsePipes, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameState } from '@dungeon-maister/data-models';
import { moveEntity, performSkillCheck, AbilityService, InventoryService, performAttack, LocationService } from '@dungeon-maister/rule-engine';
import { LlmOrchestratorService } from '@dungeon-maister/llm-orchestrator';
import { GameStateService, WorldStateService } from '@dungeon-maister/game-session';
import { AppError, Logger, ValidationError, selectEntitySchema, moveSchema, commandSchema, JoiValidationPipe, useItemSchema, useAbilitySchema, attackSchema } from '@dungeon-maister/shared';
import { GAME_EVENT_USE_ITEM, GAME_EVENT_USE_ABILITY, UseItemPayload, UseAbilityPayload, COMBAT_ACTION_ATTACK, AttackPayload } from '@dungeon-maister/data-models';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly llmOrchestrator: LlmOrchestratorService,
    private readonly gameStateService: GameStateService,
    private readonly inventoryService: InventoryService,
    private readonly abilityService: AbilityService,
    private readonly worldStateService: WorldStateService,
    private readonly locationService: LocationService,
  ) {}

  private handleError(client: Socket, error: Error) {
    Logger.error('Game Gateway Error:', error);
    if (error instanceof AppError) {
      client.emit('error', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode
      });
    } else {
      client.emit('error', {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected server error occurred.',
        statusCode: 500
      });
    }
  }

  afterInit(server: Server) {
    Logger.info('[GameGateway] Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    Logger.info(`[GameGateway] Client connected: ${client.id}`);
    const gameState = this.gameStateService.getGameState();
    if (gameState) {
      client.emit('gameState', gameState);
      client.emit('message', { type: 'narrative', content: 'Welcome back! You are reconnected.' });
    } else {
      // This could be a new client, guide them to create/join a session
      // For now, we assume character creation is the first step.
      client.emit('message', { type: 'narrative', content: 'Welcome! Please begin character creation.' });
    }
  }

  handleDisconnect(client: Socket) {
    Logger.info(`[GameGateway] Client disconnected: ${client.id}`);
  }

  @UsePipes(new JoiValidationPipe(selectEntitySchema))
  @SubscribeMessage('selectEntity')
  handleSelectEntity(@ConnectedSocket() client: Socket, @MessageBody() data: { entityId: string | null }): void {
    try {
      const gameState = this.gameStateService.getGameState();
      if (!gameState) {
        throw new Error('Game not started. Cannot select entity.');
      }
      // This is a temporary solution. In a real multi-user environment, we'd need to manage state per-user or per-session.
      gameState.selectedEntityId = data.entityId;
      this.server.emit('gameState', gameState);
    } catch (error) {
      this.handleError(client, error);
    }
  }

  @UsePipes(new JoiValidationPipe(moveSchema))
  @SubscribeMessage('move')
  async handleMove(@ConnectedSocket() client: Socket, @MessageBody() data: { direction: 'up' | 'down' | 'left' | 'right' }): Promise<void> {
    try {
      const gameState = this.gameStateService.getGameState();
      if (!gameState) {
        throw new Error('Game not started. Cannot move.');
      }
      const playerEntity = gameState.entities.find(e => e.isPlayer);
      if (playerEntity) {
        const newPosition = moveEntity(playerEntity, data.direction, gameState.map);
        playerEntity.x = newPosition.x;
        playerEntity.y = newPosition.y;
        await this.gameStateService.updateGameState(gameState);
        this.server.emit('gameState', gameState);
        this.server.emit('message', { type: 'action', content: `Player moved ${data.direction}.`, author: 'SYSTEM' });
      }
    } catch (error) {
      this.handleError(client, error);
    }
  }

  @UsePipes(new JoiValidationPipe(commandSchema))
  @SubscribeMessage('command')
  async handleCommand(@ConnectedSocket() client: Socket, @MessageBody() commandText: string): Promise<void> {
    try {
      const gameState = this.gameStateService.getGameState();
      if (!gameState) {
        throw new Error('Game not started. Cannot issue command.');
      }
      this.server.emit('message', { type: 'action', content: commandText, author: 'Player' });
      let responseMessage;
      const player = Object.values(gameState.characters).find(c => c.id.startsWith('char-'));
      if (player && commandText.toLowerCase() === 'roll perception') {
        const success = performSkillCheck(player, 'perception', 15);
        responseMessage = { type: 'narrative', content: `Player rolled perception and ${success ? 'succeeded' : 'failed'}!`, author: 'Game Master' };
      } else {
        const context = {
          gameState,
          command: commandText,
          activeEvents: this.worldStateService.getActiveEvents(),
          currentLocation: this.locationService.getLocation(gameState.mapName),
        };
        const aiContent = await this.llmOrchestrator.generateNarrative(context);
        responseMessage = { type: 'narrative', content: aiContent, author: 'Game Master' };
      }
      this.server.emit('message', responseMessage);
    } catch (error) {
      this.handleError(client, error);
    }
  }

  @UsePipes(new JoiValidationPipe(useItemSchema))
  @SubscribeMessage(GAME_EVENT_USE_ITEM)
  async handleUseItem(@ConnectedSocket() client: Socket, @MessageBody() payload: UseItemPayload): Promise<void> {
    try {
      let gameState = this.gameStateService.getGameState();
      if (!gameState) {
        throw new Error('Game not started. Cannot use item.');
      }
      
      // For now, assume the first player is the one using the item
      const player = Object.values(gameState.characters).find(c => c.id.startsWith('char-'));
      if (!player) {
        throw new Error('No player character found.');
      }

      gameState = this.inventoryService.useItem(player, payload.itemId, payload.targetId, gameState);
      
      const context = {
        gameState,
        command: `uses item ${payload.itemId}`,
        activeEvents: this.worldStateService.getActiveEvents(),
        currentLocation: this.locationService.getLocation(gameState.mapName),
      };
      const narrative = await this.llmOrchestrator.generateNarrative(context);
      this.server.emit('message', { type: 'narrative', content: narrative, author: 'Game Master' });

      await this.gameStateService.updateGameState(gameState);
      this.server.emit('gameState', gameState);
    } catch (error) {
      this.handleError(client, error);
    }
  }

  @UsePipes(new JoiValidationPipe(useAbilitySchema))
  @SubscribeMessage(GAME_EVENT_USE_ABILITY)
  async handleUseAbility(@ConnectedSocket() client: Socket, @MessageBody() payload: UseAbilityPayload): Promise<void> {
    try {
      let gameState = this.gameStateService.getGameState();
      if (!gameState) {
        throw new Error('Game not started. Cannot use ability.');
      }

      // For now, assume the first player is the one using the ability
      const player = Object.values(gameState.characters).find(c => c.id.startsWith('char-'));
      if (!player) {
        throw new Error('No player character found.');
      }

      gameState = this.abilityService.useAbility(player, payload.abilityId, payload.targetId, gameState);

      const context = {
        gameState,
        command: `uses ability ${payload.abilityId}`,
        activeEvents: this.worldStateService.getActiveEvents(),
        currentLocation: this.locationService.getLocation(gameState.mapName),
      };
      const narrative = await this.llmOrchestrator.generateNarrative(context);
      this.server.emit('message', { type: 'narrative', content: narrative, author: 'Game Master' });

      await this.gameStateService.updateGameState(gameState);
      this.server.emit('gameState', gameState);
    } catch (error) {
      this.handleError(client, error);
    }
  }

  @UsePipes(new JoiValidationPipe(attackSchema))
  @SubscribeMessage(COMBAT_ACTION_ATTACK)
  async handleAttack(@ConnectedSocket() client: Socket, @MessageBody() payload: AttackPayload): Promise<void> {
    try {
      let gameState = this.gameStateService.getGameState();
      if (!gameState || !gameState.combat?.isActive) {
        throw new Error('Cannot attack when not in combat.');
      }

      const attackerId = gameState.combat.order[gameState.combat.turn];
      const attacker = gameState.characters[attackerId];
      
      // This is a temporary solution to identify the player client
      const playerClient = Object.values(gameState.characters).find(c => c.id.startsWith('char-'));
      if (attacker.id !== playerClient.id) {
          throw new Error('Not your turn to attack.');
      }

      const defender = gameState.characters[payload.targetId];
      if (!defender) {
        throw new Error('Target not found.');
      }

      const { newGameState, narrative } = performAttack(attacker, defender, gameState);

      this.server.emit('message', { type: 'narrative', content: narrative, author: 'Game Master' });

      await this.gameStateService.updateGameState(newGameState);
      this.server.emit('gameState', newGameState);
    } catch (error) {
      this.handleError(client, error);
    }
  }


}
