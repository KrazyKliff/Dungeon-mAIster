# Rule Engine Module

The `rule-engine` is a fundamental library in the Chronicle Core framework, responsible for handling all deterministic game mechanics. Its primary role is to provide a stable, predictable, and fair set of rules that govern the game world, ensuring that outcomes are based on established mechanics rather than AI narration.

This module is designed to be completely independent of the `llm-orchestrator` to prevent AI "hallucinations" of rules and to maintain a clear separation between creative storytelling and core game logic.

## Core Responsibilities

-   **Character Management**: Handles the creation, modification, and progression of characters.
-   **Skill and Action Resolution**: Determines the outcome of character actions, such as skill checks.
-   **Combat Mechanics**: Manages turn order, actions, and outcomes during combat encounters.
-   **World Generation**: Procedurally generates maps and populates them with props and enemies.
-   **Game World State**: Manages dynamic world events and location data.

## API Overview

The `rule-engine` exposes a collection of services, each responsible for a specific domain of game mechanics.

### 1. Character Creation Service (`character-creation.service.ts`)

This service manages the entire lifecycle of a character, from initial creation to applying modifications from various game events.

-   `createBaselineCharacter(id: string, name: string): Character`
    Creates a new character with default starting attributes. This is the foundation upon which all other character modifications are applied.

-   `applySpeciesFeature(character: Character, feature: SpeciesFeature): Character`
-   `applyOrigin(character: Character, origin: Origin): Character`
-   `applyLifeEvent(character: Character, lifeEvent: LifeEvent): Character`
-   `applyCareer(character: Character, career: Career): Character`
-   `applyDevotion(character: Character, devotion: Devotion): Character`
-   `applyBirthSign(character: Character, birthSign: BirthSign): Character`
    Each of these functions takes a character and a specific data model, applies the corresponding modifiers (e.g., attribute bonuses, skills, starting gear), and returns the updated character object after recalculating all derived stats.

### 2. Skill Check Service (`skill-check.service.ts`)

This service is responsible for resolving skill checks, which are fundamental to determining the outcome of many character actions.

-   `performSkillCheck(character: Character, skillId: string, dc: number): boolean`
    Performs a d20 roll and compares it against a Difficulty Class (DC) to determine success or failure. This is a placeholder and will be expanded to include character skill ranks and attribute modifiers.

### 3. Map Generation Service (`map-generation.service.ts`)

This service handles the procedural generation of game maps. It uniquely combines AI-driven parameter setting with deterministic generation.

-   `getMapParametersFromAI(theme: string): Promise<MapParameters>`
    Asynchronously queries the `llm-orchestrator` to get thematic parameters for a map, such as prop density and enemy count.

-   `generateMap(width: number, height: number, params: MapParameters): { map: MapData; props: MapProp[] }`
    Deterministically generates a map based on the provided dimensions and parameters. It uses a random walk algorithm to create the layout and places props according to the specified density and themes.

### 4. Movement Service (`movement.service.ts`)

This service manages entity movement and ensures that it adheres to the map's physical constraints.

-   `moveEntity(entity: GameEntity, direction: Direction, mapData: MapData): { x: number; y: number }`
    Calculates the new position of an entity based on a given direction and performs collision detection against the map data. It returns the new position if the move is valid, or the original position if it is blocked.

### 5. Combat Service (`combat.service.ts`)

This service provides the core functions for managing combat encounters.

-   `startCombat(entities: GameEntity[], characters: Record<string, Character>): CombatState`
    Initializes a combat encounter by taking a list of entities, determining their initiative based on character stats, and establishing the turn order.

-   `nextTurn(currentState: CombatState): CombatState`
    Advances the combat to the next turn in the established order.

-   `endCombat(): null`
    Terminates the current combat state.

### 6. World Event Service (`world-event.service.ts`)

This service is a NestJS provider that manages dynamic events in the game world based on faction influence.

-   `getTriggeredEvents(factionId: string, influence: number): WorldEvent[]`
    Checks the list of loaded world events and returns any that are triggered by a given faction reaching a certain influence threshold.

### 7. Location Service (`location.service.ts`)

This service is a NestJS provider that manages all the locations in the game world.

-   `getLocation(id: string): Location | undefined`
-   `getAllLocations(): Location[]`
    Provides methods to retrieve specific locations or a complete list of all locations, which are loaded from a JSON data file at startup.