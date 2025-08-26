import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameState } from '@dungeon-maister/data-models';
import { moveEntity, performSkillCheck, askAI } from '@dungeon-maister/rule-engine';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // For this refactoring, we'll use a static property to hold the global game state.
  // In a more complex app, this would be handled by a dedicated state management service.
  public static gameState: GameState | null = null;

  afterInit(server: Server) {
    console.log('[GameGateway] Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`[GameGateway] Client connected: ${client.id}`);
    if (GameGateway.gameState) {
      client.emit('gameState', GameGateway.gameState);
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
    if (GameGateway.gameState) {
      GameGateway.gameState.selectedEntityId = data.entityId;
      this.server.emit('gameState', GameGateway.gameState);
    }
  }

  @SubscribeMessage('move')
  handleMove(client: Socket, data: { direction: 'up' | 'down' | 'left' | 'right' }): void {
    if (GameGateway.gameState) {
      const playerEntity = GameGateway.gameState.entities.find(e => e.isPlayer);
      if (playerEntity) {
        const newPosition = moveEntity(playerEntity, data.direction, GameGateway.gameState.map);
        playerEntity.x = newPosition.x;
        playerEntity.y = newPosition.y;
        this.server.emit('gameState', GameGateway.gameState);
        this.server.emit('message', { type: 'action', content: `Player moved ${data.direction}.`, author: 'SYSTEM' });
      }
    }
  }

  @SubscribeMessage('command')
  async handleCommand(client: Socket, commandText: string): Promise<void> {
    if (GameGateway.gameState) {
      this.server.emit('message', { type: 'action', content: commandText, author: 'Player' });
      let responseMessage;
      const player = Object.values(GameGateway.gameState.characters).find(c => c.id.startsWith('char-'));
      if (player && commandText.toLowerCase() === 'roll perception') {
        const success = performSkillCheck(player, 'perception', 15);
        responseMessage = { type: 'narrative', content: `Player rolled perception and ${success ? 'succeeded' : 'failed'}!`, author: 'Game Master' };
      } else {
        const aiContent = await askAI(commandText);
        responseMessage = { type: 'narrative', content: aiContent, author: 'Game Master' };
      }
      this.server.emit('message', responseMessage);
    }
  }

  // Method to allow other parts of the app (like CharacterCreationGateway) to update the state
  public static updateGameState(newState: GameState) {
    GameGateway.gameState = newState;
  }
}
