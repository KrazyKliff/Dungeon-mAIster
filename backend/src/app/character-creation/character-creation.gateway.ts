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
import { GameStateService } from '@dungeon-maister/game-session';

@WebSocketGateway({ cors: { origin: '*' } })
export class CharacterCreationGateway {
  @WebSocketServer()
  server: Server;

  private charactersInProgress = new Map<string, Map<string, Character>>();
  private completedCharacters = new Map<string, Set<string>>();

  constructor(
    private readonly dataAccess: DataAccessService,
    private readonly gameStateService: GameStateService
  ) {}

  @SubscribeMessage(CC_EVENT_START)
  handleStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CCStartPayload
  ): void {
    const { sessionId, characterId, name } = payload;
    client.join(sessionId);

    let session = this.charactersInProgress.get(sessionId);
    if (!session) {
      session = new Map<string, Character>();
      this.charactersInProgress.set(sessionId, session);
    }

    const character = createBaselineCharacter(characterId, name);
    session.set(characterId, character);

    this.server.to(sessionId).emit(CC_EVENT_CHARACTER_UPDATED, { character });
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
    const { sessionId, characterId, choiceId, step } = payload;
    const session = this.charactersInProgress.get(sessionId);
    if (!session) { return; }
    let character = session.get(characterId);
    if (!character) { return; }

    let nextStep: ChoiceStep | 'complete' = 'complete';

    switch (step) {
      case 'kingdom':
        nextStep = 'species_feature';
        break;
      case 'species_feature':
        const feature = this.dataAccess.getMammalFeatures().find(f => f.id === choiceId);
        if (feature) character = applySpeciesFeature(character, feature);
        nextStep = 'origin';
        break;
      case 'origin':
        const origin = this.dataAccess.getOrigins().find(o => o.id === choiceId);
        if (origin) character = applyOrigin(character, origin);
        nextStep = 'life_event';
        break;
      case 'life_event':
        const lifeEvent = this.dataAccess.getLifeEvents().find(le => le.id === choiceId);
        if (lifeEvent) character = applyLifeEvent(character, lifeEvent);
        nextStep = 'career';
        break;
      case 'career':
        const career = this.dataAccess.getCareers().find(c => c.id === choiceId);
        if (career) character = applyCareer(character, career);
        nextStep = 'devotion';
        break;
      case 'devotion':
         const devotion = this.dataAccess.getDevotions().find(d => d.id === choiceId);
         if (devotion) character = applyDevotion(character, devotion);
         nextStep = 'complete';
         break;
    }

    session.set(characterId, character);
    this.server.to(sessionId).emit(CC_EVENT_CHARACTER_UPDATED, { character });
    client.emit(CC_EVENT_READY_FOR_NEXT_STEP, { nextStep });

    if (nextStep === 'complete') {
      this.handleCharacterCompletion(sessionId, characterId);
    }
  }

  private handleCharacterCompletion(sessionId: string, characterId: string): void {
    let completed = this.completedCharacters.get(sessionId);
    if (!completed) {
      completed = new Set<string>();
      this.completedCharacters.set(sessionId, completed);
    }
    completed.add(characterId);

    const session = this.charactersInProgress.get(sessionId);
    // Assuming a 3-player game
    if (session && completed.size === 3 && session.size === 3) {
      this._finalizeSession(sessionId);
    }
  }

  private _finalizeSession(sessionId: string): void {
    const session = this.charactersInProgress.get(sessionId);
    if (!session) { return; }

    const characters = Array.from(session.values());
    console.log(`[CharCreate]: All characters finalized for session ${sessionId}. Initializing new game state...`);

    const newGameState = this.gameStateService.createInitialGameState(characters);

    this.charactersInProgress.delete(sessionId);
    this.completedCharacters.delete(sessionId);
    console.log(`[CharCreate]: Game state for session ${sessionId} initialized.`);

    this.server.to(sessionId).emit(CC_EVENT_COMPLETE, { characters });
    this.server.to(sessionId).emit('gameState', newGameState);
  }
}
