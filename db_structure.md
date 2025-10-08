# Chronicle Core TTRPG Framework - Database Structure & File Directory

## Table of Contents
1. [Project File Structure](#project-file-structure)
2. [Module Dependencies & Connections](#module-dependencies--connections)
3. [Import/Export Relationships](#importexport-relationships)
4. [Content Pack Structure](#content-pack-structure)
5. [Configuration Files](#configuration-files)
6. [Test Files](#test-files)
7. [Build & Development Files](#build--development-files)

---

## Project File Structure

### Root Level Files
```
Dungeon-mAIster/
├── 📄 README.md                           # Project overview and vision
├── 📄 ARCHITECTURE.md                     # System architecture documentation
├── 📄 CONTRIBUTING.md                     # Contribution guidelines
├── 📄 DEVELOPMENT_GUIDE.md                # Nx development workflow guide
├── 📄 project_specs.md                    # Complete project specifications
├── 📄 project_health_report.md            # Project health assessment
├── 📄 LICENSE                             # MIT License
├── 📄 package.json                        # Root package dependencies
├── 📄 package-lock.json                   # Dependency lock file
├── 📄 nx.json                             # Nx monorepo configuration
├── 📄 tsconfig.base.json                  # Base TypeScript configuration
├── 📄 jest.config.ts                      # Root Jest configuration
├── 📄 jest.preset.js                      # Jest preset configuration
├── 📄 eslint.config.mjs                   # ESLint configuration
├── 📄 Dockerfile                          # Docker container configuration
├── 📄 server.js                           # Development server script
└── 📄 tests/server.test.js                # Server test file
```

---

## Module Dependencies & Connections

### 1. Backend Server (`backend/`)
```
backend/
├── 📁 src/
│   ├── 📄 main.ts                         # 🚀 Entry point - NestJS server bootstrap
│   ├── 📄 main.spec.ts                    # Main module tests
│   └── 📁 app/
│       ├── 📄 app.module.ts               # 🏗️ Root module - imports all services
│       ├── 📁 character-creation/
│       │   └── 📄 character-creation.gateway.ts  # 🔌 WebSocket gateway for character creation
│       └── 📁 game/
│           └── 📄 game.gateway.ts         # 🔌 WebSocket gateway for game actions
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.app.json                   # App-specific TypeScript config
├── 📄 tsconfig.spec.json                  # Test-specific TypeScript config
├── 📄 jest.config.ts                      # Jest test configuration
├── 📄 eslint.config.mjs                   # ESLint configuration
└── 📄 Dockerfile                          # Docker configuration
```

**Connections:**
- **Imports**: `@dungeon-maister/core-data`, `@dungeon-maister/game-session`, `@dungeon-maister/llm-orchestrator`
- **Exports**: WebSocket gateways, NestJS server
- **Dependencies**: NestJS, Socket.IO, Express

### 2. Rule Engine (`rule-engine/`)
```
rule-engine/
├── 📁 src/
│   ├── 📄 index.ts                        # 📤 Public API exports
│   ├── 📄 rule-engine.ts                  # Main module file
│   ├── 📄 rule-engine.spec.ts             # Module tests
│   └── 📁 lib/
│       ├── 📄 character-creation.service.ts      # 👤 Character creation logic
│       ├── 📄 character-creation.service.spec.ts # Character creation tests
│       ├── 📄 skill-check.service.ts             # 🎲 Skill check mechanics
│       ├── 📄 combat.service.ts                  # ⚔️ Combat system
│       ├── 📄 movement.service.ts                # 🚶 Movement and collision
│       ├── 📄 map-generation.service.ts          # 🗺️ Procedural map generation
│       ├── 📄 location.service.ts                # 📍 Location management
│       └── 📄 world-event.service.ts             # 🌍 World event processing
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.lib.json                   # Library-specific TypeScript config
├── 📄 tsconfig.spec.json                  # Test-specific TypeScript config
├── 📄 jest.config.ts                      # Jest test configuration
├── 📄 eslint.config.mjs                   # ESLint configuration
└── 📄 README.md                           # Module documentation
```

**Connections:**
- **Imports**: `@dungeon-maister/data-models`, `@dungeon-maister/core-data`, `@dungeon-maister/llm-orchestrator`
- **Exports**: All game mechanics services
- **Dependencies**: NestJS providers, file system operations

### 3. LLM Orchestrator (`llm-orchestrator/`)
```
llm-orchestrator/
├── 📁 src/
│   ├── 📄 index.ts                        # 📤 Public API exports
│   └── 📁 lib/
│       ├── 📄 llm-orchestrator.service.ts # 🤖 Main AI orchestration service
│       ├── 📄 llm-orchestrator.spec.ts    # Service tests
│       ├── 📄 llm.service.ts               # 🔌 LLM API integration
│       └── 📁 dto/
│           └── 📄 map-parameters.dto.ts    # 📋 Map parameters data transfer object
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.lib.json                   # Library-specific TypeScript config
├── 📄 tsconfig.spec.json                  # Test-specific TypeScript config
├── 📄 jest.config.ts                      # Jest test configuration
├── 📄 eslint.config.mjs                   # ESLint configuration
└── 📄 README.md                           # Module documentation
```

**Connections:**
- **Imports**: `@dungeon-maister/core-data`, `@dungeon-maister/data-models`, `@dungeon-maister/game-session`, `@dungeon-maister/rule-engine`
- **Exports**: AI services and DTOs
- **Dependencies**: Axios for HTTP requests, NestJS

### 4. Game Session (`game-session/`)
```
game-session/
├── 📁 src/
│   ├── 📄 index.ts                        # 📤 Public API exports
│   └── 📁 lib/
│       ├── 📄 game-session.module.ts      # 🏗️ Module definition
│       ├── 📄 game-state.service.ts       # 🎮 Game state management
│       ├── 📄 world-state.service.ts      # 🌍 World state management
│       └── 📄 world-bootstrapper.service.ts # 🚀 World initialization
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.lib.json                   # Library-specific TypeScript config
├── 📄 tsconfig.spec.json                  # Test-specific TypeScript config
├── 📄 jest.config.ts                      # Jest test configuration
├── 📄 eslint.config.mjs                   # ESLint configuration
└── 📄 README.md                           # Module documentation
```

**Connections:**
- **Imports**: `@dungeon-maister/core-data`, `@dungeon-maister/data-models`, `@dungeon-maister/rule-engine`
- **Exports**: Game session services and module
- **Dependencies**: NestJS, file system operations

### 5. Data Models (`data-models/`)
```
data-models/
├── 📁 src/
│   ├── 📄 index.ts                        # 📤 Public API exports
│   ├── 📄 data-models.ts                  # Main module file
│   ├── 📄 data-models.spec.ts             # Module tests
│   └── 📁 lib/
│       ├── 📄 character.model.ts          # 👤 Character data structure
│       ├── 📄 character-creation.model.ts  # 🎭 Character creation data
│       ├── 📄 character-creation-events.model.ts # 📝 Character creation events
│       ├── 📄 attributes.model.ts         # 💪 Character attributes
│       ├── 📄 skills.model.ts             # 🎯 Skills and abilities
│       ├── 📄 rules.model.ts              # 📜 Game rules definitions
│       ├── 📄 map.model.ts                # 🗺️ Map and game state
│       ├── 📄 location.model.ts           # 📍 Location data
│       ├── 📄 lore.model.ts               # 📚 World lore and factions
│       ├── 📄 world.model.ts              # 🌍 World state
│       └── 📄 message.model.ts            # 💬 Game messages
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.lib.json                   # Library-specific TypeScript config
├── 📄 tsconfig.spec.json                  # Test-specific TypeScript config
├── 📄 jest.config.ts                      # Jest test configuration
├── 📄 eslint.config.mjs                   # ESLint configuration
└── 📄 README.md                           # Module documentation
```

**Connections:**
- **Imports**: None (base models)
- **Exports**: All TypeScript interfaces and types
- **Dependencies**: None (pure TypeScript)

### 6. Core Data (`core-data/`)
```
core-data/
├── 📁 src/
│   ├── 📄 index.ts                        # 📤 Public API exports
│   ├── 📄 core-data.module.ts             # 🏗️ Module definition
│   ├── 📄 data-store.ts                   # 🗄️ Data loading and management
│   ├── 📄 location.models.ts              # 📍 Location data models
│   ├── 📄 lore-loading.spec.ts            # Lore loading tests
│   └── 📁 lib/
│       ├── 📁 character-creation/          # 🎭 Character creation content
│       │   ├── 📄 kingdoms.json           # 🏰 Kingdom definitions
│       │   ├── 📄 mammal-features.json   # 🐾 Species features
│       │   ├── 📄 origins.json            # 🌱 Character origins
│       │   ├── 📄 life-events.json        # 📅 Life events
│       │   ├── 📄 careers.json            # 💼 Career paths
│       │   ├── 📄 devotions.json          # 🙏 Religious devotions
│       │   └── 📄 birth-signs.json        # ⭐ Birth signs
│       ├── 📁 lore/                       # 📚 World lore content
│       │   ├── 📄 commonwealths.json      # 🏛️ Major factions
│       │   ├── 📄 unaligned_peoples.json  # 🏕️ Independent groups
│       │   ├── 📄 beliefs.json            # 🧠 Belief systems
│       │   ├── 📄 history.json            # 📜 Historical events
│       │   ├── 📄 locations.json          # 📍 World locations
│       │   └── 📄 world-events.json      # 🌍 Dynamic events
│       └── 📁 rules/                      # 📜 Game rules content
│           ├── 📄 skills.json             # 🎯 Skill definitions
│           ├── 📄 combat.json             # ⚔️ Combat rules
│           ├── 📄 critical-hits.json      # 💥 Critical hit rules
│           ├── 📄 death.json              # 💀 Death and dying rules
│           └── 📄 environment.json        # 🌿 Environmental rules
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.spec.json                  # Test-specific TypeScript config
├── 📄 jest.config.ts                      # Jest test configuration
└── 📄 README.md                           # Module documentation
```

**Connections:**
- **Imports**: `@dungeon-maister/data-models`
- **Exports**: All content pack data and loading functions
- **Dependencies**: File system operations, JSON parsing

### 7. Host Application (`host-app/`)
```
host-app/
├── 📁 src/
│   ├── 📄 main.tsx                        # 🚀 React application entry point
│   └── 📁 app/
│       ├── 📄 app.tsx                     # 🏠 Main application component
│       ├── 📄 app.spec.tsx                # App component tests
│       ├── 📄 nx-welcome.tsx              # Nx welcome component
│       ├── 📄 narrative-log.tsx            # 📝 Narrative display component
│       ├── 📄 map-viewer.tsx              # 🗺️ Interactive map component
│       ├── 📄 ai-debug-viewer.tsx         # 🐛 AI debug interface
│       ├── 📁 layout/
│       │   └── 📄 HostLayout.tsx          # 🏗️ Main layout component
│       └── 📁 components/
│           ├── 📄 MenuBar.tsx             # 📋 Top menu bar
│           ├── 📄 InfoBar.tsx             # ℹ️ Information display
│           ├── 📄 TechnicalLog.tsx        # 🔧 Technical logging
│           └── 📁 character-creation/
│               ├── 📄 CharacterCreationWizard.tsx # 🧙 Character creation wizard
│               └── 📁 steps/
│                   └── 📄 SelectKingdom.tsx # 🏰 Kingdom selection step
├── 📁 src/lib/data/
│   ├── 📄 prop.models.ts                  # 🎭 Prop data models
│   └── 📄 grid.models.ts                 # 📐 Grid system models
├── 📄 index.html                          # 🌐 HTML entry point
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.app.json                   # App-specific TypeScript config
├── 📄 tsconfig.spec.json                 # Test-specific TypeScript config
├── 📄 jest.config.ts                     # Jest test configuration
├── 📄 eslint.config.mjs                   # ESLint configuration
├── 📄 vite.config.ts                     # Vite build configuration
└── 📁 public/
    └── 📄 favicon.ico                     # 🌐 Website icon
```

**Connections:**
- **Imports**: `@dungeon-maister/data-models`, `@dungeon-maister/ui-shared`, `socket.io-client`
- **Exports**: React application
- **Dependencies**: React, Socket.IO, Vite

### 8. Mobile Application (`mobile-app/`)
```
mobile-app/
├── 📁 src/
│   ├── 📄 main.tsx                        # 🚀 React Native entry point
│   ├── 📄 main-web.tsx                    # 🌐 Web version entry point
│   └── 📁 app/
│       ├── 📄 App.tsx                     # 📱 Main mobile app component
│       ├── 📄 App.spec.tsx                # App component tests
│       └── 📁 screens/
│           ├── 📄 CharacterSheetScreen.tsx # 👤 Character sheet display
│           ├── 📄 ImmersiveScreen.tsx      # 🎮 Main game interface
│           ├── 📄 InventoryScreen.tsx      # 🎒 Inventory management
│           ├── 📄 ActionsScreen.tsx        # ⚡ Action input interface
│           └── 📄 CharacterCreationScreen.tsx # 🧙 Character creation
├── 📁 android/                            # 🤖 Android-specific files
│   ├── 📁 app/
│   │   ├── 📄 build.gradle                # Android build configuration
│   │   ├── 📄 debug.keystore              # Debug signing key
│   │   ├── 📄 proguard-rules.pro          # ProGuard rules
│   │   └── 📁 src/main/
│   │       ├── 📄 AndroidManifest.xml     # Android manifest
│   │       ├── 📁 java/com/mobileapp/     # Java source files
│   │       └── 📁 res/                    # Android resources
│   ├── 📄 build.gradle                    # Root Android build config
│   ├── 📄 gradle.properties              # Gradle properties
│   ├── 📄 settings.gradle                 # Gradle settings
│   ├── 📄 gradlew                         # Gradle wrapper (Unix)
│   └── 📄 gradlew.bat                     # Gradle wrapper (Windows)
├── 📁 ios/                                # 🍎 iOS-specific files
│   ├── 📁 MobileApp/                      # iOS app bundle
│   │   ├── 📄 Info.plist                  # iOS app info
│   │   └── 📁 Images.xcassets/           # iOS image assets
│   ├── 📁 MobileApp.xcodeproj/            # Xcode project
│   ├── 📁 MobileApp.xcworkspace/          # Xcode workspace
│   └── 📄 Podfile                         # CocoaPods dependencies
├── 📄 app.json                            # React Native app configuration
├── 📄 index.html                          # 🌐 Web version HTML
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.app.json                   # App-specific TypeScript config
├── 📄 tsconfig.spec.json                 # Test-specific TypeScript config
├── 📄 jest.config.ts                     # Jest test configuration
├── 📄 eslint.config.mjs                   # ESLint configuration
├── 📄 vite.config.ts                     # Vite build configuration
├── 📄 metro.config.js                     # Metro bundler configuration
├── 📄 package.json                        # Mobile app dependencies
├── 📄 package-lock.json                   # Dependency lock file
└── 📁 public/
    └── 📄 favicon.ico                     # 🌐 Website icon
```

**Connections:**
- **Imports**: `@dungeon-maister/data-models`, `@dungeon-maister/ui-shared`, `socket.io-client`, `react-navigation`
- **Exports**: React Native application
- **Dependencies**: React Native, Socket.IO, React Navigation

### 9. UI Shared Library (`ui-shared/`)
```
ui-shared/
├── 📁 src/
│   ├── 📄 index.ts                        # 📤 Public API exports
│   └── 📁 lib/
│       └── 📄 theme.ts                    # 🎨 Theme system and styling
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.lib.json                   # Library-specific TypeScript config
├── 📄 tsconfig.spec.json                 # Test-specific TypeScript config
├── 📄 package.json                        # UI library dependencies
├── 📄 rollup.config.cjs                   # Rollup build configuration
└── 📄 README.md                           # Module documentation
```

**Connections:**
- **Imports**: None (base UI components)
- **Exports**: Theme system, shared components
- **Dependencies**: Emotion for styling

### 10. Test Suites

#### Backend E2E Tests (`backend-e2e/`)
```
backend-e2e/
├── 📁 src/
│   ├── 📁 backend/
│   │   └── 📄 backend.spec.ts             # 🧪 Backend API E2E tests
│   └── 📁 support/
│       ├── 📄 global-setup.ts             # 🚀 Global test setup
│       ├── 📄 global-teardown.ts          # 🧹 Global test cleanup
│       └── 📄 test-setup.ts               # ⚙️ Test configuration
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.spec.json                 # Test-specific TypeScript config
├── 📄 jest.config.ts                      # Jest test configuration
└── 📄 eslint.config.mjs                   # ESLint configuration
```

#### Host App E2E Tests (`host-app-e2e/`)
```
host-app-e2e/
├── 📁 src/
│   └── 📄 example.spec.ts                 # 🧪 Host app E2E tests
├── 📄 project.json                        # Nx project configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 playwright.config.ts               # Playwright configuration
└── 📄 eslint.config.mjs                   # ESLint configuration
```

---

## Import/Export Relationships

### Core Dependency Chain
```
data-models (base)
    ↑
core-data → rule-engine → game-session → backend
    ↑           ↑            ↑
ui-shared → host-app    mobile-app
    ↑           ↑            ↑
llm-orchestrator ←──────────┘
```

### Detailed Import Map

#### `data-models` (Foundation Layer)
- **Exports**: All TypeScript interfaces and types
- **Imports**: None (pure TypeScript definitions)
- **Used By**: All other modules

#### `core-data` (Content Layer)
- **Exports**: Content loading functions, JSON data
- **Imports**: `@dungeon-maister/data-models`
- **Used By**: `rule-engine`, `llm-orchestrator`, `game-session`

#### `rule-engine` (Logic Layer)
- **Exports**: Game mechanics services
- **Imports**: `@dungeon-maister/data-models`, `@dungeon-maister/core-data`, `@dungeon-maister/llm-orchestrator`
- **Used By**: `game-session`, `backend`

#### `llm-orchestrator` (AI Layer)
- **Exports**: AI services and DTOs
- **Imports**: `@dungeon-maister/core-data`, `@dungeon-maister/data-models`, `@dungeon-maister/game-session`, `@dungeon-maister/rule-engine`
- **Used By**: `rule-engine`, `backend`

#### `game-session` (Session Layer)
- **Exports**: Game session services
- **Imports**: `@dungeon-maister/core-data`, `@dungeon-maister/data-models`, `@dungeon-maister/rule-engine`
- **Used By**: `backend`

#### `ui-shared` (UI Layer)
- **Exports**: Theme system, shared components
- **Imports**: None
- **Used By**: `host-app`, `mobile-app`

#### `backend` (Server Layer)
- **Exports**: WebSocket gateways, NestJS server
- **Imports**: `@dungeon-maister/core-data`, `@dungeon-maister/game-session`, `@dungeon-maister/llm-orchestrator`
- **Used By**: `host-app`, `mobile-app`

#### `host-app` (Web Client)
- **Exports**: React application
- **Imports**: `@dungeon-maister/data-models`, `@dungeon-maister/ui-shared`, `socket.io-client`
- **Used By**: None (end application)

#### `mobile-app` (Mobile Client)
- **Exports**: React Native application
- **Imports**: `@dungeon-maister/data-models`, `@dungeon-maister/ui-shared`, `socket.io-client`, `react-navigation`
- **Used By**: None (end application)

---

## Data Type Specifications & Consistency Standards

### Core Data Types

#### Primitive Types
```typescript
// String Types
type ID = string;                    // Unique identifier (kebab-case)
type Name = string;                  // Display name (Title Case)
type Description = string;           // Descriptive text (sentence case)
type Formula = string;               // Mathematical formula (e.g., "d20 + modifier")

// Numeric Types
type Score = number;                 // Attribute/skill score (1-20)
type Modifier = number;              // Calculated modifier (score - 10) / 2
type Level = number;                 // Character level (1-20)
type Tier = 1 | 2 | 3;               // Skill tier (1=General, 2=Advanced, 3=Master)
type MasteryTier = number;          // Character skill mastery (1-10)

// Boolean Types
type IsActive = boolean;            // Active state flag
type IsPlayer = boolean;            // Player vs NPC flag

// Coordinate Types
type Coordinate = number;            // Map coordinate (0-based)
type Position = { x: number; y: number; }; // 2D position

// Resource Types
type ResourcePool = { current: number; max: number; }; // HP/SP/EP pools
```

#### Complex Data Types

##### Character Data Structure
```typescript
interface Character {
  id: ID;                           // "character-001"
  name: Name;                       // "Valerius"
  
  // Attributes (12 sub-attributes, 6 primary)
  subAttributes: Record<SubAttributeName, SubAttribute>;
  primaryAttributes: Record<PrimaryAttributeName, PrimaryAttribute>;
  
  // Skills and progression
  skills: CharacterSkill[];
  level: Level;
  
  // Resource pools
  hp: ResourcePool;                 // Hit Points
  sp: ResourcePool;                 // Stamina Points  
  ep: ResourcePool;                 // Energy Points
  
  // Derived stats
  defense: number;
  movementSpeed: number;            // feet per round
  initiative: number;
  carryingCapacity: number;         // pounds
  
  // Species bonuses
  speciesHpBonus: number;
  speciesSpBonus: number;
  speciesEpBonus: number;
  speciesSpeedBonus: number;
  speciesCarryingBonus: number;
  
  // Inventory (to be defined)
  inventory: unknown[];
}
```

##### Attribute System
```typescript
// Sub-attribute names (12 total)
type SubAttributeName = 
  | 'Brute Force' | 'Endurance' | 'Dexterity' | 'Reflexes'
  | 'Resilience' | 'Constitution' | 'Logic' | 'Knowledge'
  | 'Perception' | 'Intuition' | 'Charm' | 'Willpower';

// Primary attribute names (6 total)
type PrimaryAttributeName = 'STR' | 'AGI' | 'VIG' | 'INT' | 'INS' | 'PRE';

interface SubAttribute {
  name: SubAttributeName;
  score: Score;                     // 1-20
}

interface PrimaryAttribute {
  name: PrimaryAttributeName;
  score: Score;                     // Calculated average
  modifier: Modifier;               // (score - 10) / 2
}
```

##### Skill System
```typescript
type SkillCategory = 
  | 'General' | 'Weapon' | 'Armor' | 'Martial Technique'
  | 'Psionic Discipline' | 'Arcane Prime' | 'Spirit Domain' | 'Expertise Field';

interface SkillDefinition {
  id: ID;                          // "athletics", "heavy_weapons"
  name: Name;                      // "Athletics", "Heavy Weapons"
  description: Description;
  category: SkillCategory;
  tier: Tier;                      // 1, 2, or 3
  governingSubAttribute: SubAttributeName;
  combatActions?: CombatAction[];
}

interface CharacterSkill {
  id: ID;                          // References SkillDefinition.id
  masteryTier: MasteryTier;        // 1-10
}

interface CombatAction {
  name: Name;
  description: Description;
}
```

##### Map and Game State
```typescript
type MapData = number[][];          // 2D array: 0=wall, 1=floor

interface MapProp {
  name: Name;
  x: Coordinate;
  y: Coordinate;
}

interface GameEntity {
  id: ID;
  name: Name;
  x: Coordinate;
  y: Coordinate;
  isPlayer: IsPlayer;
}

interface CombatState {
  isActive: IsActive;
  turn: number;                    // Current turn index
  order: ID[];                     // Array of entity IDs in turn order
}

interface GameState {
  map: MapData;
  mapName: Name;
  mapDescription: Description;
  entities: GameEntity[];
  props: MapProp[];
  characters: Record<ID, Character>;
  selectedEntityId: ID | null;
  combat: CombatState | null;
}
```

### JSON Content Pack Data Formats

#### Character Creation Content (`core-data/src/lib/character-creation/`)

##### Kingdoms Format
```json
[
  {
    "id": "vaneer-concord",           // kebab-case identifier
    "name": "The Vaneer Concord",      // Title Case display name
    "description": "The wealthiest...", // Sentence case description
    "type": "Commonwealth",            // Category type
    "capital": "Vaneer"               // Capital city name
  }
]
```

##### Species Features Format
```json
[
  {
    "id": "Mammal",                   // Species identifier
    "name": "Mammal",                 // Display name
    "description": "Adaptable and social...", // Description
    "primarySubStats": [              // Array of SubAttributeName
      "Charm", 
      "Endurance"
    ]
  }
]
```

##### Origins Format
```json
[
  {
    "id": "the_wilds",               // kebab-case identifier
    "name": "The Wilds",             // Title Case display name
    "description": "Grants proficiency...", // Description
    "skillProficiencies": [          // Array of skill IDs
      "survival", 
      "nature"
    ]
  }
]
```

##### Skills Format
```json
[
  {
    "id": "athletics",               // kebab-case identifier
    "name": "Athletics",             // Title Case display name
    "description": "Covers climbing...", // Sentence case description
    "category": "General",           // SkillCategory enum
    "tier": 1,                      // Tier number (1-3)
    "governingSubAttribute": "Brute Force", // SubAttributeName
    "combatActions": [              // Optional combat actions
      {
        "name": "Tumble",           // Action name
        "description": "move through..." // Action description
      }
    ]
  }
]
```

#### Lore Content (`core-data/src/lib/lore/`)

##### Factions Format
```json
[
  {
    "id": "vaneer-concord",          // kebab-case identifier
    "name": "The Vaneer Concord",     // Title Case display name
    "description": "The wealthiest...", // Detailed description
    "type": "Commonwealth",          // Faction type
    "capital": "Vaneer",            // Capital city
    "locations": ["vaneer", "skyport"] // Optional location IDs
  }
]
```

##### Beliefs Format
```json
[
  {
    "id": "belief-id",              // kebab-case identifier
    "name": "Belief Name",           // Title Case display name
    "description": "Description...", // Belief description
    "faction": "faction-id",        // Associated faction ID
    "boon": {                       // Optional mechanical benefit
      "type": "bonus_type",
      "value": 2,
      "description": "Effect description"
    }
  }
]
```

##### Locations Format
```json
[
  {
    "id": "location_001",           // Sequential identifier
    "name": "The Rusty Flagon",     // Title Case display name
    "description": "A cozy tavern..." // Location description
  }
]
```

#### Rules Content (`core-data/src/lib/rules/`)

##### Combat Rules Format
```json
{
  "combatFlow": {
    "type": "turn-based",           // Combat type
    "roundDuration": "6 seconds",   // Round duration
    "initiative": {
      "formula": "d20 + Agility modifier", // Initiative formula
      "description": "Roll initiative..." // Description
    },
    "turn": {
      "apAllocation": "3 AP per turn", // Action points
      "actions": [                   // Available actions
        {
          "name": "Move",
          "cost": "1 AP",
          "description": "Move up to speed",
          "examples": ["Walk", "Run"]
        }
      ]
    }
  },
  "attackRoll": {
    "formula": "d20 + relevant modifier", // Attack formula
    "condition": "Must have line of sight", // Conditions
    "relevantSubAttribute": [       // Attribute mappings
      {
        "weaponType": ["sword", "axe"],
        "attribute": "Brute Force"
      }
    ],
    "targetedAttacks": [            // Special attack options
      {
        "area": "head",
        "modifier": "-4",
        "effect": "double damage"
      }
    ],
    "situationalModifiers": [       // Situational bonuses/penalties
      {
        "condition": "flanking",
        "effect": "+2 to attack"
      }
    ]
  },
  "damageCalculation": {
    "formula": "weapon damage + modifier", // Damage formula
    "bonusSources": [               // Damage bonus sources
      {
        "type": "strength",
        "attribute": "Brute Force",
        "description": "Add Brute Force modifier",
        "example": "Greatsword: 2d6 + Brute Force"
      }
    ],
    "criticalSuccess": {
      "trigger": "natural 20",
      "effect": "double damage dice"
    },
    "damageReduction": "Armor reduces damage by DR value",
    "damageTypes": ["slashing", "piercing", "bludgeoning"] // Damage types
  }
}
```

##### Critical Hits Format
```json
{
  "triggerConditions": [            // When critical hits occur
    "natural 20 on attack roll",
    "natural 19-20 with improved critical"
  ],
  "criticalHitTable": {
    "name": "Critical Hit Effects",
    "roll": "d100",
    "trigger": "critical hit",
    "results": [                    // Critical hit results
      {
        "roll": 1,                 // Single number or range
        "name": "Minor Wound",
        "effect": "Target takes 1d4 additional damage"
      },
      {
        "roll": [2, 10],           // Range of rolls
        "name": "Deep Cut",
        "effect": "Target takes 1d6 additional damage and bleeds"
      }
    ]
  },
  "limbIncapacitationTable": {      // Limb-specific critical hits
    "name": "Limb Incapacitation",
    "roll": "d100",
    "trigger": "critical hit to limb",
    "results": [
      {
        "roll": 1,
        "name": "Stunned",
        "effect": "Target is stunned for 1 round"
      }
    ]
  }
}
```

### Data Validation Standards

#### ID Format Rules
- **Pattern**: `^[a-z0-9]+(-[a-z0-9]+)*$` (kebab-case)
- **Examples**: `vaneer-concord`, `heavy-weapons`, `location-001`
- **Length**: 3-50 characters
- **Uniqueness**: Must be unique within their category

#### Name Format Rules
- **Pattern**: `^[A-Z][a-zA-Z0-9\s\-']+$` (Title Case)
- **Examples**: `The Vaneer Concord`, `Heavy Weapons`, `The Rusty Flagon`
- **Length**: 3-100 characters
- **Special Characters**: Allow spaces, hyphens, apostrophes

#### Description Format Rules
- **Pattern**: `^[A-Z][a-zA-Z0-9\s\.,!?\-']+[.!?]$` (Sentence case)
- **Examples**: `The wealthiest and most technologically advanced power.`
- **Length**: 10-500 characters
- **Ending**: Must end with punctuation

#### Numeric Range Rules
- **Scores**: 1-20 (inclusive)
- **Modifiers**: -5 to +5 (calculated from scores)
- **Levels**: 1-20 (inclusive)
- **Tiers**: 1, 2, or 3 only
- **Mastery**: 1-10 (inclusive)
- **Coordinates**: 0 to map dimensions (exclusive)

#### Array Format Rules
- **Skill Arrays**: Must contain valid skill IDs
- **Attribute Arrays**: Must contain valid SubAttributeName values
- **ID Arrays**: Must contain valid IDs of the referenced type
- **Empty Arrays**: Allowed, use `[]` not `null`

---

## Content Pack Structure

### Character Creation Content (`core-data/src/lib/character-creation/`)
```
character-creation/
├── 📄 kingdoms.json           # 🏰 4 major kingdoms with descriptions
├── 📄 mammal-features.json    # 🐾 Species features and bonuses
├── 📄 origins.json            # 🌱 Character background origins
├── 📄 life-events.json        # 📅 Random life events
├── 📄 careers.json            # 💼 Professional career paths
├── 📄 devotions.json          # 🙏 Religious and philosophical devotions
└── 📄 birth-signs.json       # ⭐ Astrological birth signs
```

### Lore Content (`core-data/src/lib/lore/`)
```
lore/
├── 📄 commonwealths.json      # 🏛️ 4 major political factions
├── 📄 unaligned_peoples.json # 🏕️ Independent groups and tribes
├── 📄 beliefs.json            # 🧠 Religious and philosophical beliefs
├── 📄 history.json            # 📜 Historical events and timeline
├── 📄 locations.json           # 📍 World locations and landmarks
└── 📄 world-events.json       # 🌍 Dynamic world events
```

### Rules Content (`core-data/src/lib/rules/`)
```
rules/
├── 📄 skills.json             # 🎯 Skill definitions and mechanics
├── 📄 combat.json             # ⚔️ Combat rules and calculations
├── 📄 critical-hits.json      # 💥 Critical hit tables and effects
├── 📄 death.json              # 💀 Death, dying, and resurrection rules
└── 📄 environment.json        # 🌿 Environmental effects and hazards
```

---

## Configuration Files

### Build Configuration
```
Root Level:
├── 📄 nx.json                 # Nx monorepo configuration
├── 📄 tsconfig.base.json      # Base TypeScript configuration
├── 📄 jest.config.ts         # Root Jest configuration
├── 📄 eslint.config.mjs      # ESLint configuration
└── 📄 package.json           # Root dependencies

Per Module:
├── 📄 project.json            # Nx project configuration
├── 📄 tsconfig.json          # Module TypeScript configuration
├── 📄 tsconfig.app.json       # Application-specific config
├── 📄 tsconfig.lib.json      # Library-specific config
├── 📄 tsconfig.spec.json      # Test-specific config
├── 📄 jest.config.ts         # Module Jest configuration
└── 📄 eslint.config.mjs      # Module ESLint configuration
```

### Platform-Specific Configuration
```
Mobile App:
├── 📄 app.json                # React Native app configuration
├── 📄 metro.config.js         # Metro bundler configuration
├── 📄 vite.config.ts         # Vite build configuration
├── 📄 package.json           # Mobile app dependencies
├── 📁 android/               # Android build files
└── 📁 ios/                   # iOS build files

Host App:
├── 📄 vite.config.ts         # Vite build configuration
├── 📄 index.html             # HTML entry point
└── 📁 public/                # Static assets
```

---

## Test Files

### Test Coverage Summary
- **Total Test Files**: 8
- **Total TypeScript Files**: 88
- **Test Coverage**: ~9%

### Test File Locations
```
Tests by Module:
├── 📄 backend/src/main.spec.ts                    # Backend entry point tests
├── 📄 backend-e2e/src/backend/backend.spec.ts     # Backend E2E tests
├── 📄 host-app/src/app/app.spec.tsx               # Host app component tests
├── 📄 host-app-e2e/src/example.spec.ts            # Host app E2E tests
├── 📄 mobile-app/src/app/App.spec.tsx             # Mobile app component tests
├── 📄 rule-engine/src/lib/rule-engine.spec.ts     # Rule engine tests
├── 📄 rule-engine/src/lib/character-creation.service.spec.ts # Character creation tests
├── 📄 llm-orchestrator/src/lib/llm-orchestrator.spec.ts # LLM orchestrator tests
├── 📄 data-models/src/lib/data-models.spec.ts     # Data models tests
└── 📄 core-data/src/lib/lore-loading.spec.ts     # Lore loading tests
```

---

## Build & Development Files

### Development Scripts
```bash
# Development Commands
npx nx serve host-app          # Start host app development server
npx nx serve backend           # Start backend development server
npx nx serve mobile-app        # Start mobile app development server

# Build Commands
npx nx build host-app          # Build host app for production
npx nx build backend           # Build backend for production
npx nx build mobile-app        # Build mobile app for production

# Test Commands
npx nx test rule-engine        # Run rule engine tests
npx nx test data-models       # Run data models tests
npx nx test backend-e2e       # Run backend E2E tests

# Utility Commands
npx nx graph                   # Visualize project dependencies
npx nx affected --target=test  # Run tests on affected projects
npx nx reset                   # Clear Nx cache
```

### Docker Configuration
```
Docker Files:
├── 📄 Dockerfile              # Root Docker configuration
└── 📄 backend/Dockerfile      # Backend-specific Docker config
```

### Log Files
```
Runtime Logs:
├── 📄 backend.log             # Backend server logs
└── 📄 host-app.log            # Host app logs
```

---

## File Connection Summary

### Critical Connection Points
1. **WebSocket Communication**: `backend` ↔ `host-app` ↔ `mobile-app`
2. **Data Flow**: `data-models` → `core-data` → `rule-engine` → `game-session` → `backend`
3. **AI Integration**: `llm-orchestrator` ↔ `rule-engine` ↔ `backend`
4. **UI Consistency**: `ui-shared` → `host-app` + `mobile-app`
5. **Content Loading**: `core-data` → All game logic modules

### Development Workflow
1. **Content Updates**: Modify JSON files in `core-data/src/lib/`
2. **Logic Changes**: Update services in `rule-engine/src/lib/`
3. **AI Integration**: Modify `llm-orchestrator/src/lib/`
4. **UI Updates**: Change components in `host-app/` or `mobile-app/`
5. **Backend Changes**: Update `backend/src/app/`

This structure provides a complete roadmap for navigating the Chronicle Core project, understanding file relationships, and maintaining development context across the entire codebase.
