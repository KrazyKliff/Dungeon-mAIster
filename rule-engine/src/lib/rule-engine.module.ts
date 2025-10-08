import { Module } from '@nestjs/common';
import { AbilityService } from './ability.service';
import { CharacterCreationService } from './character-creation.service';
import { CombatService } from './combat.service';
import { InventoryService } from './inventory.service';
import { LocationService } from './location.service';
import { MapGenerationService } from './map-generation.service';
import { MovementService } from './movement.service';
import { SkillCheckService } from './skill-check.service';
import { WorldEventService } from './world-event.service';

const services = [
  AbilityService,
  CharacterCreationService,
  CombatService,
  InventoryService,
  LocationService,
  MapGenerationService,
  MovementService,
  SkillCheckService,
  WorldEventService,
];

@Module({
  providers: [...services],
  exports: [...services],
})
export class RuleEngineModule {}
