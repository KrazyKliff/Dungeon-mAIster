import { Injectable } from '@nestjs/common';
import { DataAccessService } from './data-access.service';
import {
  CombatRules,
  CriticalHits,
  DeathRules,
  EnvironmentRules,
  SkillDefinition,
} from '@dungeon-maister/data-models';

@Injectable()
export class RulesProvider {
  constructor(private readonly dataAccess: DataAccessService) {}

  public getCombatRules(): CombatRules | null {
    return this.dataAccess.getCombatRules();
  }

  public getCriticalHits(): CriticalHits | null {
    return this.dataAccess.getCriticalHits();
  }

  public getDeathRules(): DeathRules | null {
    return this.dataAccess.getDeathRules();
  }

  public getEnvironmentRules(): EnvironmentRules | null {
    return this.dataAccess.getEnvironmentRules();
  }

  public getAllSkills(): SkillDefinition[] {
    return this.dataAccess.getSkills();
  }

  /**
   * Finds a skill by its unique ID (e.g., 'athletics').
   * @param skillId The ID of the skill to find.
   * @returns The SkillDefinition or undefined if not found.
   */
  public findSkillById(skillId: string): SkillDefinition | undefined {
    return this.dataAccess.getSkills().find((skill) => skill.id === skillId);
  }

  /**
   * Finds a skill by its display name (e.g., 'Athletics'). This is case-insensitive.
   * @param name The name of the skill to find.
   * @returns The SkillDefinition or undefined if not found.
   */
  public findSkillByName(name: string): SkillDefinition | undefined {
    const lowerCaseName = name.toLowerCase();
    return this.dataAccess
      .getSkills()
      .find((skill) => skill.name.toLowerCase() === lowerCaseName);
  }
}
