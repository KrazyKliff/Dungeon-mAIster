import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DataAccessService } from '@dungeon-maister/core-data';
import {
  Character,
  GameState,
  CC_EVENT_START, CCStartPayload,
  CC_EVENT_GET_CHOICES, CCGetChoicesPayload,
  CC_EVENT_SELECT_CHOICE, CCSelectChoicePayload,
  CC_EVENT_FINALIZE, CCFinalizePayload,
  CC_EVENT_CHOICES_LIST,
  CC_EVENT_CHARACTER_UPDATED,
  CC_EVENT_READY_FOR_NEXT_STEP,
  CC_EVENT_COMPLETE,
  ChoiceStep,
} from '@dungeon-maister/data-models';
import {
  createBaselineCharacter,
  applyOrigin,
  applyLifeEvent,
  applyCareer,
  applyDevotion,
  applyBirthSign,
  applySpeciesFeature,
  getMapParametersFromAI,
  generateMap,
} from '@dungeon-maister/rule-engine';
import { GameGateway } from '../game/game.gateway';

@WebSocketGateway({ cors: { origin: '*' } })
export class CharacterCreationGateway {
  @WebSocketServer()
  server: Server;

  private charactersInProgress = new Map<string, Character>();

  constructor(private readonly dataAccess: DataAccessService) {}

  @SubscribeMessage(CC_EVENT_START)
  handleStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CCStartPayload
  ): void {
    const character = createBaselineCharacter(payload.characterId, payload.name);
    this.charactersInProgress.set(payload.characterId, character);

    client.emit(CC_EVENT_CHARACTER_UPDATED, { character });
    client.emit(CC_EVENT_READY_FOR_NEXT_STEP, { nextStep: 'kingdom' });
  }

  @SubscribeMessage(CC_EVENT_GET_CHOICES)
  handleGetChoices(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CCGetChoicesPayload
  ): void {
    let choices = [];
    switch (payload.step) {
      case 'kingdom': choices = this.dataAccess.getKingdoms(); break;
      case 'origin': choices = this.dataAccess.getOrigins(); break;
      case 'life_event': choices = this.dataAccess.getLifeEvents(); break;
      case 'career': choices = this.dataAccess.getCareers(); break;
      case 'species_feature': choices = this.dataAccess.getMammalFeatures(); break;
      case 'devotion': choices = this.dataAccess.getDevotions(); break;
      case 'birth_sign': choices = this.dataAccess.getBirthSigns(); break;
    }
    client.emit(CC_EVENT_CHOICES_LIST, { step: payload.step, choices });
  }

  @SubscribeMessage(CC_EVENT_SELECT_CHOICE)
  handleSelectChoice(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CCSelectChoicePayload
  ): void {
    let character = this.charactersInProgress.get(payload.characterId);
    if (!character) { return; }

    let nextStep: ChoiceStep | 'complete' = 'complete';

    switch (payload.step) {
      case 'kingdom':
        nextStep = 'species_feature';
        break;
      case 'species_feature':
        const feature = this.dataAccess.getMammalFeatures().find(f => f.id === payload.choiceId);
        if (feature) character = applySpeciesFeature(character, feature);
        nextStep = 'origin';
        break;
      case 'origin':
        const origin = this.dataAccess.getOrigins().find(o => o.id === payload.choiceId);
        if (origin) character = applyOrigin(character, origin);
        nextStep = 'life_event';
        break;
      case 'life_event':
        const lifeEvent = this.dataAccess.getLifeEvents().find(le => le.id === payload.choiceId);
        if (lifeEvent) character = applyLifeEvent(character, lifeEvent);
        nextStep = 'career';
        break;
      case 'career':
        const career = this.dataAccess.getCareers().find(c => c.id === payload.choiceId);
        if (career) character = applyCareer(character, career);
        nextStep = 'devotion';
        break;
      case 'devotion':
         const devotion = this.dataAccess.getDevotions().find(d => d.id === payload.choiceId);
         if (devotion) character = applyDevotion(character, devotion);
         nextStep = 'complete';
         break;
    }

    this.charactersInProgress.set(payload.characterId, character);
    client.emit(CC_EVENT_CHARACTER_UPDATED, { character });
    client.emit(CC_EVENT_READY_FOR_NEXT_STEP, { nextStep });
  }

  @SubscribeMessage(CC_EVENT_FINALIZE)
  async handleFinalize(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CCFinalizePayload
  ): Promise<void> {
    const character = this.charactersInProgress.get(payload.characterId);
    if (!character) { return; }

    console.log('[CharCreate]: Character finalized. Initializing new game state...');
    const mapParams = await getMapParametersFromAI('a forgotten goblin outpost');
    const { map, props } = generateMap(20, 15, mapParams);
    let startPos = { x: 0, y: 0 };
    for (let y = 0; y < map.length; y++) { const x = map[y].indexOf(0); if (x > -1) { startPos = { x, y }; break; } }

    const newGameState: GameState = {
      map,
      props,
      entities: [{ id: character.id, name: character.name, x: startPos.x, y: startPos.y, isPlayer: true }],
      characters: { [character.id]: character },
      selectedEntityId: null,
    };

    GameGateway.updateGameState(newGameState);
    this.charactersInProgress.delete(payload.characterId);
    console.log('[CharCreate]: Game state initialized.');

    client.emit(CC_EVENT_COMPLETE, { character });
    this.server.emit('gameState', newGameState);
  }
}
