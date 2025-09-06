import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameState } from '@dungeon-maister/data-models';
import { moveEntity, performSkillCheck } from '@dungeon-maister/rule-engine';
import { LlmOrchestratorService } from '@dungeon-maister/llm-orchestrator';
import { GameStateService } from '@dungeon-maister/game-session';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly llmOrchestrator: LlmOrchestratorService,
    private readonly gameStateService: GameStateService
  ) {}

  afterInit(server: Server) {
    console.log('[GameGateway] Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`[GameGateway] Client connected: ${client.id}`);
    const gameState = this.gameStateService.getGameState();
    if (gameState) {
      client.emit('gameState', gameState);
      client.emit('message', { type: 'narrative', content: 'Welcome back! You are reconnected.' });
    } else {
      client.emit('message', { type: 'narrative', content: 'Welcome! Please begin character creation.' });
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[GameGateway] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('selectEntity')
  handleSelectEntity(client: Socket, data: { entityId: string | null }): void {
    const gameState = this.gameStateService.getGameState();
    if (gameState) {
      gameState.selectedEntityId = data.entityId;
      this.server.emit('gameState', gameState);
    }
  }

  @SubscribeMessage('move')
  handleMove(client: Socket, data: { direction: 'up' | 'down' | 'left' | 'right' }): void {
    const gameState = this.gameStateService.getGameState();
    if (gameState) {
      const playerEntity = gameState.entities.find(e => e.isPlayer);
      if (playerEntity) {
        const newPosition = moveEntity(playerEntity, data.direction, gameState.map);
        playerEntity.x = newPosition.x;
        playerEntity.y = newPosition.y;
        this.server.emit('gameState', gameState);
        this.server.emit('message', { type: 'action', content: `Player moved ${data.direction}.`, author: 'SYSTEM' });
      }
    }
  }

  @SubscribeMessage('command')
  async handleCommand(client: Socket, commandText: string): Promise<void> {
    const gameState = this.gameStateService.getGameState();
    if (gameState) {
      this.server.emit('message', { type: 'action', content: commandText, author: 'Player' });
      let responseMessage;
      const player = Object.values(gameState.characters).find(c => c.id.startsWith('char-'));
      if (player && commandText.toLowerCase() === 'roll perception') {
        const success = performSkillCheck(player, 'perception', 15);
        responseMessage = { type: 'narrative', content: `Player rolled perception and ${success ? 'succeeded' : 'failed'}!`, author: 'Game Master' };
      } else {
        const aiContent = await this.llmOrchestrator.generateNarrative(gameState, commandText);
        responseMessage = { type: 'narrative', content: aiContent, author: 'Game Master' };
      }
      this.server.emit('message', responseMessage);
    }
  }
}
