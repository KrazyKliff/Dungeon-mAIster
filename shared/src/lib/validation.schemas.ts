import Joi from 'joi';

// --- Character Creation Schemas ---

export const ccStartSchema = Joi.object({
  sessionId: Joi.string().required(),
  characterId: Joi.string().required(),
  name: Joi.string().min(2).max(50).required(),
});

export const ccGetChoicesSchema = Joi.object({
  step: Joi.string().valid('kingdom', 'origin', 'life_event', 'career', 'species_feature', 'devotion', 'birth_sign').required(),
});

export const ccSelectChoiceSchema = Joi.object({
  sessionId: Joi.string().required(),
  characterId: Joi.string().required(),
  step: Joi.string().required(),
  choiceId: Joi.string().required(),
});


// --- Game Gateway Schemas ---

export const selectEntitySchema = Joi.object({
  entityId: Joi.string().allow(null),
});

export const moveSchema = Joi.object({
  direction: Joi.string().valid('up', 'down', 'left', 'right').required(),
});

export const commandSchema = Joi.string().min(1).max(280).required();

export const useItemSchema = Joi.object({
  itemId: Joi.string().required(),
  targetId: Joi.string().optional(),
});

export const useAbilitySchema = Joi.object({
  abilityId: Joi.string().required(),
  targetId: Joi.string().optional(),
});

export const attackSchema = Joi.object({
  targetId: Joi.string().required(),
});
