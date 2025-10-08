import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody, ConnectedSocket, UsePipes } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  getKingdoms,
  getOrigins,
  getLifeEvents,
  getCareers,
  getMammalFeatures,
  getDevotions,
  getBirthSigns,
} from '@dungeon-maister/core-data';
import {
  Character,
  CC_EVENT_START, CCStartPayload,
  CC_EVENT_GET_CHOICES, CCGetChoicesPayload,
  CC_EVENT_SELECT_CHOICE, CCSelectChoicePayload,
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
} from '@dungeon-maister/rule-engine';
import { GameStateService } from '@dungeon-maister/game-session';
import { AppError, Logger, ValidationError, ccStartSchema, ccGetChoicesSchema, ccSelectChoiceSchema, JoiValidationPipe } from '@dungeon-maister/shared';

@WebSocketGateway({ cors: { origin: '*' } })
export class CharacterCreationGateway {
  @WebSocketServer()
  server: Server;

  private charactersInProgress = new Map<string, Map<string, Character>>();
  private completedCharacters = new Map<string, Set<string>>();

  constructor(private readonly gameStateService: GameStateService) {}

  private handleError(client: Socket, error: Error) {
    Logger.error('Character Creation Gateway Error:', error);
    if (error instanceof AppError) {
      client.emit('error', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode
      });
    } else {
      client.emit('error', {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected server error occurred during character creation.',
        statusCode: 500
      });
    }
  }

  @UsePipes(new JoiValidationPipe(ccStartSchema))
  @SubscribeMessage(CC_EVENT_START)
  handleStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() { sessionId, characterId, name }: CCStartPayload
  ): void {
    try {
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
    } catch (error) {
      this.handleError(client, error);
    }
  }

  @UsePipes(new JoiValidationPipe(ccGetChoicesSchema))
  @SubscribeMessage(CC_EVENT_GET_CHOICES)
  handleGetChoices(
    @ConnectedSocket() client: Socket,
    @MessageBody() { step }: CCGetChoicesPayload
  ): void {
    try {
      let choices = [];
      switch (step) {
        case 'kingdom': choices = getKingdoms(); break;
        case 'origin': choices = getOrigins(); break;
        case 'life_event': choices = getLifeEvents(); break;
        case 'career': choices = getCareers(); break;
        case 'species_feature': choices = getMammalFeatures(); break;
        case 'devotion': choices = getDevotions(); break;
        case 'birth_sign': choices = getBirthSigns(); break;
      }
      client.emit(CC_EVENT_CHOICES_LIST, { step, choices });
    } catch (error) {
      this.handleError(client, error);
    }
  }

  @UsePipes(new JoiValidationPipe(ccSelectChoiceSchema))
  @SubscribeMessage(CC_EVENT_SELECT_CHOICE)
  handleSelectChoice(
    @ConnectedSocket() client: Socket,
    @MessageBody() { sessionId, characterId, choiceId, step }: CCSelectChoicePayload
  ): void {
    try {
      const session = this.charactersInProgress.get(sessionId);
      if (!session) {
        throw new ValidationError(`Invalid session ID: ${sessionId}`);
      }
      let character = session.get(characterId);
      if (!character) {
        throw new ValidationError(`Character not found in session: ${characterId}`);
      }

      let nextStep: ChoiceStep | 'complete' = 'complete';

      switch (step) {
        case 'kingdom': {
          nextStep = 'species_feature';
          break;
        }
        case 'species_feature': {
          const feature = getMammalFeatures().find(f => f.id === choiceId);
          if (feature) character = applySpeciesFeature(character, feature);
          nextStep = 'origin';
          break;
        }
        case 'origin': {
          const origin = getOrigins().find(o => o.id === choiceId);
          if (origin) character = applyOrigin(character, origin);
          nextStep = 'life_event';
          break;
        }
        case 'life_event': {
          const lifeEvent = getLifeEvents().find(le => le.id === choiceId);
          if (lifeEvent) character = applyLifeEvent(character, lifeEvent);
          nextStep = 'career';
          break;
        }
        case 'career': {
          const career = getCareers().find(c => c.id === choiceId);
          if (career) character = applyCareer(character, career);
          nextStep = 'devotion';
          break;
        }
        case 'devotion': {
          const devotion = getDevotions().find(d => d.id === choiceId);
          if (devotion) character = applyDevotion(character, devotion);
          nextStep = 'complete';
          break;
        }
        default:
          throw new ValidationError(`Invalid choice step during selection: ${step}`);
      }

      session.set(characterId, character);
      this.server.to(sessionId).emit(CC_EVENT_CHARACTER_UPDATED, { character });
      client.emit(CC_EVENT_READY_FOR_NEXT_STEP, { nextStep });

      if (nextStep === 'complete') {
        this.handleCharacterCompletion(sessionId, characterId);
      }
    } catch (error) {
      this.handleError(client, error);
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
    // Assuming a 2-player game for now
    if (session && completed.size === 2 && session.size === 2) {
      this._finalizeSession(sessionId);
    }
  }

  private async _finalizeSession(sessionId: string): Promise<void> {
    const session = this.charactersInProgress.get(sessionId);
    if (!session) { return; }

    const characters = Array.from(session.values());
    Logger.info(`[CharCreate]: All characters finalized for session ${sessionId}. Initializing new game state...`);

    const newSessionId = await this.gameStateService.createNewGameSession(sessionId, characters);

    this.charactersInProgress.delete(sessionId);
    this.completedCharacters.delete(sessionId);
    Logger.info(`[CharCreate]: Game state for session ${newSessionId} initialized.`);

    this.server.to(sessionId).emit(CC_EVENT_COMPLETE, { characters, sessionId: newSessionId });
    const newGameState = this.gameStateService.getGameState();
    this.server.to(sessionId).emit('gameState', newGameState);
  }
}
