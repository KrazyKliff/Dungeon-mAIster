import { Kingdom, Origin, Career, Devotion, SpeciesFeature, LifeEvent, BirthSign } from './character-creation.model';
import { Character } from './character.model';

// --- Event Names ---
export const CC_EVENT_START = '[Character Creation] Start';
export const CC_EVENT_GET_CHOICES = '[Character Creation] Get Choices';
export const CC_EVENT_SELECT_CHOICE = '[Character Creation] Select Choice';
export const CC_EVENT_FINALIZE = '[Character Creation] Finalize';

export const CC_EVENT_CHOICES_LIST = '[Character Creation] Choices List';
export const CC_EVENT_CHARACTER_UPDATED = '[Character Creation] Character Updated';
export const CC_EVENT_READY_FOR_NEXT_STEP = '[Character Creation] Ready for Next Step';
export const CC_EVENT_COMPLETE = '[Character Creation] Complete';


// --- Client -> Server Payloads ---

export interface CCStartPayload {
  characterId: string;
  name: string;
}

export type ChoiceStep = 'kingdom' | 'species_feature' | 'origin' | 'life_event' | 'career' | 'devotion' | 'birth_sign';
export interface CCGetChoicesPayload {
  step: ChoiceStep;
  // Some choice lists might depend on previous choices, e.g., Devotion depends on Kingdom.
  context?: {
    kingdom?: string;
  };
}

export interface CCSelectChoicePayload {
  characterId: string;
  step: ChoiceStep;
  choiceId: string;
}

export interface CCFinalizePayload {
  characterId: string;
}


// --- Server -> Client Payloads ---

export type ChoiceList = Kingdom[] | SpeciesFeature[] | Origin[] | LifeEvent[] | Career[] | Devotion[] | BirthSign[];
export interface CCChoicesListPayload {
  step: ChoiceStep;
  choices: ChoiceList;
}

export interface CCCharacterUpdatedPayload {
  character: Character;
}

export interface CCReadyForNextStepPayload {
  nextStep: ChoiceStep | 'complete';
}

export interface CCCompletePayload {
  character: Character;
}
