# Chronicle Core TTRPG Framework - Complete Project Specifications

## Table of Contents
1. [Project Vision & Goals](#project-vision--goals)
2. [Architecture Overview](#architecture-overview)
3. [Module Specifications](#module-specifications)
4. [Current Implementation State](#current-implementation-state)
5. [Technical Implementation Details](#technical-implementation-details)
6. [Data Flow & Communication](#data-flow--communication)
7. [Development Roadmap](#development-roadmap)
8. [Quality Assurance & Testing](#quality-assurance--testing)

---

## Project Vision & Goals

### Intended Finished State

**Chronicle Core** aims to be a revolutionary tabletop role-playing game framework that combines the creativity of AI with the fairness of deterministic game mechanics. The finished product will provide:

#### Core Experience
- **AI-Driven Game Master**: A sophisticated LLM that generates dynamic narratives, manages NPCs, and adapts to player choices
- **Deterministic Core**: Fair, consistent game mechanics handled by a separate rule engine
- **Immersive Local Multiplayer**: Two-player couch co-op experience with main display and mobile controllers
- **Dynamic World**: Procedurally generated maps and adaptive storylines for high replayability

#### Technical Goals
- **Modular Architecture**: 13 distinct, loosely coupled modules for maintainability
- **Cross-Platform**: Web-based host app and React Native mobile app
- **Real-Time Communication**: WebSocket-based multiplayer synchronization
- **Content-Driven**: External JSON content packs for easy modding and expansion
- **Scalable**: Foundation for future expansion to more players and features

### Current State Summary

The project is in **early development phase** with a solid architectural foundation but incomplete core functionality. Key achievements include:

- ✅ Complete modular architecture with Nx monorepo
- ✅ Basic backend server with WebSocket communication
- ✅ Comprehensive data models and type definitions
- ✅ Character creation system framework
- ✅ Basic rule engine structure
- ✅ Frontend applications (host and mobile)
- ✅ Content pack system with rich lore data
- ⚠️ Incomplete LLM integration
- ⚠️ Limited game mechanics implementation
- ⚠️ Basic UI/UX implementation

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Chronicle Core Framework                 │
├─────────────────────────────────────────────────────────────┤
│  Frontend Layer                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Host App      │  │   Mobile App    │  │  UI Shared   │ │
│  │   (React)       │  │ (React Native)  │  │  Library     │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Communication Layer                                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              WebSocket Gateway                         │ │
│  │         (Real-time Multiplayer)                         │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Backend Services Layer                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────┐ │
│  │   Backend   │ │ Game Session │ │ LLM         │ │ Core │ │
│  │   Server    │ │ Management   │ │ Orchestrator│ │ Data │ │
│  │  (NestJS)   │ │              │ │             │ │      │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────┘ │
├─────────────────────────────────────────────────────────────┤
│  Game Logic Layer                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────┐ │
│  │ Rule Engine │ │ Data Models │ │ Map         │ │ Test │ │
│  │             │ │             │ │ Generation  │ │ Suites│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────┘ │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Content Packs (JSON)                      │ │
│  │  Rules | Lore | Character Creation | Locations         │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Module Dependencies

```
backend
├── game-session
├── llm-orchestrator
├── rule-engine
├── data-models
├── core-data
└── ui-shared

host-app
├── ui-shared
├── data-models
└── socket.io-client

mobile-app
├── ui-shared
├── data-models
└── socket.io-client

rule-engine
├── data-models
└── core-data

llm-orchestrator
├── data-models
├── core-data
└── game-session

game-session
├── data-models
├── core-data
└── rule-engine
```

---

## Module Specifications

### 1. Backend Server (`backend/`)

#### Intended Functionality
- **Central Server**: NestJS-based server managing all game logic
- **WebSocket Gateway**: Real-time communication between host and mobile clients
- **API Endpoints**: RESTful APIs for game state management
- **Session Management**: Handle multiple concurrent game sessions
- **Security**: Authentication and authorization for players

#### Current Implementation
```typescript
// backend/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`[server]: NestJS application is running on port ${PORT}`);
}
```

**Technical Details:**
- **Framework**: NestJS with WebSocket support via Socket.IO
- **Port**: 3000 (configurable via environment)
- **Modules**: AppModule imports CoreDataModule and GameSessionModule
- **Gateways**: CharacterCreationGateway and GameGateway for WebSocket handling
- **Providers**: LlmOrchestratorService for AI integration

**Status**: ✅ **Functional** - Basic server running with WebSocket support

### 2. Rule Engine (`rule-engine/`)

#### Intended Functionality
- **Deterministic Mechanics**: All game rules, dice rolls, combat calculations
- **Character Management**: Creation, progression, and modification
- **Combat System**: Turn order, damage calculation, status effects
- **Skill Checks**: Attribute-based skill resolution with modifiers
- **World Physics**: Movement, collision detection, environmental effects

#### Current Implementation

**Character Creation Service:**
```typescript
// rule-engine/src/lib/character-creation.service.ts
export function createBaselineCharacter(id: string, name: string): Character {
  return {
    id,
    name,
    subAttributes: {
      'Strength': { score: 10, modifier: 0 },
      'Agility': { score: 10, modifier: 0 },
      // ... other attributes
    },
    primaryAttributes: {
      'STR': { score: 10, modifier: 0 },
      // ... other primary attributes
    },
    skills: [],
    level: 1,
    hp: { current: 10, max: 10 },
    sp: { current: 10, max: 10 },
    ep: { current: 10, max: 10 },
    defense: 10,
    movementSpeed: 30,
    initiative: 10,
    carryingCapacity: 100,
    // ... species bonuses
    inventory: []
  };
}
```

**Skill Check Service:**
```typescript
// rule-engine/src/lib/skill-check.service.ts
export function performSkillCheck(character: Character, skillId: string, dc: number): boolean {
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll; // TODO: Add character modifiers
  console.log(`- Player rolled a ${roll}. DC was ${dc}.`);
  return total >= dc;
}
```

**Combat Service:**
```typescript
// rule-engine/src/lib/combat.service.ts
export function startCombat(entities: GameEntity[], characters: Record<string, Character>): CombatState {
  const combatants = entities
    .map((entity) => ({
      id: entity.id,
      initiative: characters[entity.id].initiative,
    }))
    .sort((a, b) => b.initiative - a.initiative);

  return {
    isActive: true,
    turn: 0,
    order: combatants.map((c) => c.id),
  };
}
```

**Technical Details:**
- **Character Creation**: ✅ Complete baseline character generation
- **Skill Checks**: ⚠️ Basic d20 roll without modifiers
- **Combat**: ✅ Turn order calculation, ⚠️ Missing damage/healing
- **Movement**: ✅ Basic collision detection
- **Map Generation**: ✅ Procedural dungeon generation

**Status**: ⚠️ **Partially Complete** - Core structure exists, needs enhancement

### 3. LLM Orchestrator (`llm-orchestrator/`)

#### Intended Functionality
- **AI Integration**: Seamless connection to cloud-based LLM services
- **Prompt Engineering**: Sophisticated prompt construction with game context
- **Response Processing**: Parse and validate AI responses
- **Context Management**: Maintain conversation history and world state
- **Fallback Handling**: Graceful degradation when AI is unavailable

#### Current Implementation

**LLM Service:**
```typescript
// llm-orchestrator/src/lib/llm.service.ts
export async function askAI(prompt: string): Promise<string> {
  const apiUrl = 'http://localhost:8080/v1/chat/completions';
  
  try {
    const response = await axios.post(apiUrl, {
      model: 'llama3', // Hardcoded model
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling local OpenWebUI API:', error.response?.data || error.message);
    return 'Sorry, the local AI server is not responding.';
  }
}
```

**Orchestrator Service:**
```typescript
// llm-orchestrator/src/lib/llm-orchestrator.service.ts
public async generateNarrative(gameState: GameState, command: string): Promise<string> {
  // TODO: Implement this properly
  return "The AI is not yet implemented.";
}

public async generateMapParameters(): Promise<MapParameters> {
  // TODO: Implement this properly
  console.log('TODO: Implement generateMapParameters properly');
  return {
    theme: 'dungeon',
    propDensity: 'medium',
    enemyCount: 5,
  };
}
```

**Technical Details:**
- **API Integration**: ⚠️ Hardcoded localhost URL and model name
- **Prompt Building**: ✅ Context-aware prompt construction
- **Error Handling**: ⚠️ Basic error handling with fallback messages
- **Response Processing**: ⚠️ No validation or parsing of AI responses
- **Context Management**: ✅ Game state integration

**Status**: ⚠️ **Incomplete** - Basic structure exists, needs full implementation

### 4. Game Session Management (`game-session/`)

#### Intended Functionality
- **Session Lifecycle**: Create, manage, and terminate game sessions
- **State Persistence**: Save and load game states
- **World Management**: Track faction influence and world events
- **Player Coordination**: Manage multiple players in a session
- **Event Processing**: Handle game events and state transitions

#### Current Implementation

**Game State Service:**
```typescript
// game-session/src/lib/game-state.service.ts
@Injectable()
export class GameStateService {
  private gameState: GameState | null = null;

  public createInitialGameState(characters: Character[]): GameState {
    // TODO: This logic is moved from CharacterCreationGateway.
    // We need a better way to get map parameters.
    const { map, props } = generateMap(20, 20, {
      theme: 'dungeon',
      propDensity: 'medium',
      enemyCount: 5,
    });

    return {
      mapName: 'test-dungeon',
      mapDescription: 'A mysterious dungeon',
      map,
      entities: characters.map(char => ({
        id: char.id,
        name: char.name,
        x: 1,
        y: 1,
        isPlayer: true,
      })),
      props,
      characters: characters.reduce((acc, char) => {
        acc[char.id] = char;
        return acc;
      }, {} as Record<string, Character>),
      selectedEntityId: characters[0]?.id || null,
      combat: null,
    };
  }
}
```

**World State Service:**
```typescript
// game-session/src/lib/world-state.service.ts
@Injectable()
export class WorldStateService {
  private worldState: WorldState;

  private initialize(): void {
    const factions = getFactions();
    const factionInfluences: FactionInfluence[] = factions.map((faction) => ({
      factionId: faction.id,
      influence: 10, // Default influence
    }));
    const locations = this.locationService.getAllLocations();

    this.worldState = {
      factionInfluences,
      activeEvents: [],
      locations,
    };
  }
}
```

**Technical Details:**
- **State Management**: ✅ Basic game state creation and management
- **World Events**: ✅ Faction influence tracking
- **Persistence**: ❌ No save/load functionality
- **Session Management**: ⚠️ Single session support
- **Event Processing**: ⚠️ Basic world event handling

**Status**: ⚠️ **Partially Complete** - Core functionality exists, needs persistence

### 5. Data Models (`data-models/`)

#### Intended Functionality
- **Type Safety**: Comprehensive TypeScript interfaces for all game entities
- **Validation**: JSON schema validation for data integrity
- **Serialization**: Proper data serialization/deserialization
- **Versioning**: Data model versioning for backward compatibility
- **Documentation**: Self-documenting interfaces with JSDoc

#### Current Implementation

**Character Model:**
```typescript
// data-models/src/lib/character.model.ts
export interface Character {
  id: string;
  name: string;
  subAttributes: Record<SubAttributeName, SubAttribute>;
  primaryAttributes: Record<PrimaryAttributeName, PrimaryAttribute>;
  skills: CharacterSkill[];
  level: number;
  hp: { current: number; max: number; };
  sp: { current: number; max: number; }; // Stamina Points
  ep: { current: number; max: number; }; // Energy Points
  defense: number;
  movementSpeed: number;
  initiative: number;
  carryingCapacity: number;
  speciesHpBonus: number;
  speciesSpBonus: number;
  speciesEpBonus: number;
  speciesSpeedBonus: number;
  speciesCarryingBonus: number;
  inventory: unknown[]; // TODO: Define proper inventory type
}
```

**Game State Model:**
```typescript
// data-models/src/lib/map.model.ts
export interface GameState {
  mapName: string;
  mapDescription: string;
  map: MapData;
  entities: GameEntity[];
  props: MapProp[];
  characters: Record<string, Character>;
  selectedEntityId: string | null;
  combat: CombatState | null;
}
```

**Technical Details:**
- **Type Definitions**: ✅ Comprehensive interfaces for all entities
- **Validation**: ❌ No JSON schema validation implemented
- **Serialization**: ✅ Basic TypeScript serialization
- **Versioning**: ❌ No versioning system
- **Documentation**: ⚠️ Limited JSDoc comments

**Status**: ✅ **Mostly Complete** - Strong type definitions, needs validation

### 6. Core Data (`core-data/`)

#### Intended Functionality
- **Content Management**: Load and serve all game content from JSON files
- **Data Validation**: Ensure content integrity with schema validation
- **Hot Reloading**: Support for content updates without server restart
- **Mod Support**: Enable external content packs
- **Caching**: Efficient content caching and retrieval

#### Current Implementation

**Data Store:**
```typescript
// core-data/src/lib/data-store.ts
const assetPath = process.env.NODE_ENV === 'test'
  ? path.join(process.cwd(), 'core-data/src/lib')
  : path.join(__dirname, 'assets');

function loadDataFile<T>(dataPath: string, fileName: string): T {
  const filePath = path.join(dataPath, fileName);
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log(`[DataStore] Successfully read ${fileName}.`);
    return JSON.parse(fileContent) as T;
  } catch (error) {
    console.error(`[DataStore] Failed to read or parse ${fileName} from ${filePath}`);
    throw error;
  }
}

// Load all content packs
const kingdoms: Kingdom[] = loadDataFile<Kingdom[]>(charCreationPath, 'kingdoms.json');
const mammalFeatures: SpeciesFeature[] = loadDataFile<SpeciesFeature[]>(charCreationPath, 'mammal-features.json');
const origins: Origin[] = loadDataFile<Origin[]>(charCreationPath, 'origins.json');
// ... more content loading
```

**Content Packs Available:**
- **Character Creation**: kingdoms.json, mammal-features.json, origins.json, life-events.json, careers.json, devotions.json, birth-signs.json
- **Lore**: commonwealths.json, unaligned_peoples.json, beliefs.json, history.json, locations.json, world-events.json
- **Rules**: skills.json, combat.json, critical-hits.json, death.json, environment.json

**Technical Details:**
- **Content Loading**: ✅ Synchronous file loading at startup
- **Data Validation**: ❌ No schema validation
- **Hot Reloading**: ❌ No support for runtime updates
- **Mod Support**: ❌ No external content pack support
- **Caching**: ✅ In-memory caching of loaded content

**Status**: ✅ **Functional** - Content loading works, needs validation and mod support

### 7. Host Application (`host-app/`)

#### Intended Functionality
- **Main Display**: Large screen interface for game world visualization
- **Map Viewer**: Interactive map with entity positioning and movement
- **Narrative Display**: Rich text display for AI-generated content
- **GM Tools**: Game master interface for session management
- **Real-time Updates**: Live synchronization with game state

#### Current Implementation

**Main App Component:**
```typescript
// host-app/src/app/app.tsx
export function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });
    
    newSocket.on('gameState', (newGameState: GameState) => {
      setGameState(newGameState);
    });
    
    newSocket.on('narrative', (message: GameMessage) => {
      setMessages(prev => [...prev, message]);
    });
  }, []);
}
```

**Map Viewer:**
```typescript
// host-app/src/app/map-viewer.tsx
export const MapViewer: React.FC<MapViewerProps> = ({ 
  mapData, entities, props, selectedEntityId, onEntityClick 
}) => {
  return (
    <div style={{ border: '1px solid #555', padding: '10px' }}>
      <div style={{ display: 'inline-block', backgroundColor: '#000', position: 'relative' }}>
        {/* Render Map Tiles */}
        {mapData.map((row, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                style={{
                  ...tileStyle,
                  backgroundColor: tile === 1 ? '#4a4a4a' : '#2a2a2a',
                }}
              />
            ))}
          </div>
        ))}
        {/* Render Props and Entities */}
      </div>
    </div>
  );
};
```

**Technical Details:**
- **WebSocket Integration**: ✅ Real-time connection to backend
- **Map Rendering**: ✅ Basic tile-based map display
- **Entity Management**: ✅ Player and prop positioning
- **UI Components**: ⚠️ Basic styling, needs enhancement
- **State Management**: ✅ React state management

**Status**: ✅ **Functional** - Basic interface works, needs UI/UX enhancement

### 8. Mobile Application (`mobile-app/`)

#### Intended Functionality
- **Player Interface**: Personal device interface for each player
- **Character Management**: Character sheet and stats display
- **Action Input**: Command input and action selection
- **Inventory Management**: Item management and equipment
- **Real-time Sync**: Live updates with game state

#### Current Implementation

**Main App:**
```typescript
// mobile-app/src/app/App.tsx
const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const newSocket = io('http://10.0.2.2:3000'); // Android emulator IP
    setSocket(newSocket);
    newSocket.on('connect', () => {
      console.log('Socket connected!');
      setIsConnected(true);
    });
    newSocket.on('gameState', (newGameState: GameState) => {
      setGameState(newGameState);
    });
  }, []);

  return (
    <NavigationContainer>
      {!gameState ? (
        <CharacterCreationScreen socket={socket} />
      ) : (
        <Tab.Navigator>
          <Tab.Screen name="Character" component={CharacterSheetScreen} />
          <Tab.Screen name="Home" component={ImmersiveScreen} />
          <Tab.Screen name="Inventory" component={InventoryScreen} />
          <Tab.Screen name="Actions" component={ActionsScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};
```

**Actions Screen:**
```typescript
// mobile-app/src/app/screens/ActionsScreen.tsx
export const ActionsScreen = () => {
  const [command, setCommand] = useState('');

  const sendCommand = () => {
    // In a real app, this would emit the command via socket
    console.log('Sending command:', command);
    setCommand('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actions</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={command}
          onChangeText={setCommand}
          placeholder="What do you want to do?"
        />
        <TouchableOpacity style={styles.button} onPress={sendCommand}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

**Technical Details:**
- **React Native**: ✅ Cross-platform mobile development
- **Navigation**: ✅ Tab-based navigation system
- **WebSocket**: ✅ Real-time communication
- **UI Components**: ⚠️ Basic styling with dark theme
- **State Management**: ✅ React state management

**Status**: ✅ **Functional** - Basic mobile interface, needs feature completion

### 9. UI Shared Library (`ui-shared/`)

#### Intended Functionality
- **Component Library**: Reusable components for both web and mobile
- **Theme System**: Consistent design system across platforms
- **Type Definitions**: Shared TypeScript interfaces
- **Utility Functions**: Common helper functions
- **Accessibility**: WCAG compliance and accessibility features

#### Current Implementation

**Theme System:**
```typescript
// ui-shared/src/lib/theme.ts
export const darkTheme = {
  colors: {
    primary: '#1a1a1a',
    secondary: '#2a2a2a',
    surface: '#333333',
    background: '#0a0a0a',
    text: '#ffffff',
    accent: '#4a9eff',
    error: '#ff4444',
    warning: '#ffaa00',
    success: '#44ff44',
  },
  typography: {
    fontFamily: {
      heading: 'Inter-Bold',
      body: 'Inter-Regular',
      mono: 'JetBrainsMono-Regular',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};
```

**Technical Details:**
- **Theme System**: ✅ Dark theme with color palette
- **Typography**: ✅ Font family and size definitions
- **Spacing**: ✅ Consistent spacing system
- **Components**: ❌ No shared components yet
- **Accessibility**: ❌ No accessibility features

**Status**: ⚠️ **Basic** - Theme system exists, needs component library

---

## Current Implementation State

### ✅ Completed Features

1. **Project Structure**: Complete Nx monorepo with 13 modules
2. **Backend Server**: NestJS server with WebSocket support
3. **Data Models**: Comprehensive TypeScript interfaces
4. **Content System**: JSON-based content packs with rich lore
5. **Character Creation**: Basic character generation framework
6. **Map Generation**: Procedural dungeon generation
7. **Frontend Apps**: Basic React and React Native interfaces
8. **Real-time Communication**: WebSocket-based multiplayer
9. **Rule Engine Structure**: Basic combat and skill check systems
10. **Build System**: Complete Nx build and development workflow

### ⚠️ Partially Complete Features

1. **LLM Integration**: Basic structure, needs full implementation
2. **Game Mechanics**: Core systems exist, need enhancement
3. **UI/UX**: Functional but basic interfaces
4. **Session Management**: Basic state management, no persistence
5. **Combat System**: Turn order exists, missing damage/healing
6. **Skill Checks**: Basic d20 rolls, missing modifiers
7. **World Events**: Basic faction system, needs event processing

### ❌ Missing Features

1. **Save/Load System**: No game state persistence
2. **Advanced Combat**: Damage calculation, status effects
3. **Inventory System**: Item management and equipment
4. **Quest System**: Dynamic quest generation and tracking
5. **NPC System**: AI-driven NPC behavior and dialogue
6. **Mod Support**: External content pack loading
7. **Authentication**: Player authentication and authorization
8. **Analytics**: Game metrics and player behavior tracking
9. **Performance Optimization**: Caching and optimization
10. **Error Handling**: Comprehensive error handling and recovery

---

## Technical Implementation Details

### WebSocket Communication Protocol

**Connection Flow:**
```typescript
// Client connects to server
const socket = io('http://localhost:3000');

// Server handles connection
@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
}
```

**Message Types:**
- `gameState`: Complete game state synchronization
- `narrative`: AI-generated narrative text
- `playerAction`: Player command/action
- `characterUpdate`: Character state changes
- `combatUpdate`: Combat state changes

### Data Flow Architecture

```
Player Action (Mobile) 
    ↓ WebSocket
Backend Server (NestJS)
    ↓ Service Call
Game Session Service
    ↓ Rule Check
Rule Engine
    ↓ AI Request
LLM Orchestrator
    ↓ Response
Game State Update
    ↓ Broadcast
Host App + Mobile Apps
```

### Database Schema (Intended)

```sql
-- Game Sessions
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  game_state JSONB
);

-- Players
CREATE TABLE players (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id),
  name VARCHAR(255),
  character_data JSONB
);

-- Game Events
CREATE TABLE game_events (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id),
  event_type VARCHAR(100),
  event_data JSONB,
  timestamp TIMESTAMP
);
```

### API Endpoints (Intended)

```typescript
// REST API Endpoints
GET    /api/sessions              // List game sessions
POST   /api/sessions              // Create new session
GET    /api/sessions/:id          // Get session details
PUT    /api/sessions/:id          // Update session
DELETE /api/sessions/:id          // Delete session

POST   /api/sessions/:id/players  // Add player to session
PUT    /api/sessions/:id/players/:playerId // Update player
DELETE /api/sessions/:id/players/:playerId // Remove player

POST   /api/sessions/:id/actions  // Process player action
GET    /api/sessions/:id/state    // Get current game state
```

---

## Data Flow & Communication

### Real-time Communication Flow

1. **Player Input**: Mobile app captures player action
2. **WebSocket Send**: Action sent to backend via WebSocket
3. **Gateway Processing**: GameGateway receives and validates action
4. **Service Layer**: Action forwarded to appropriate service
5. **Rule Engine**: Deterministic mechanics processed
6. **LLM Orchestration**: AI generates narrative response
7. **State Update**: Game state updated with results
8. **Broadcast**: Updated state sent to all connected clients
9. **UI Update**: Host and mobile apps update displays

### State Synchronization

```typescript
// Game state synchronization
interface GameStateSync {
  type: 'full' | 'delta';
  data: GameState | Partial<GameState>;
  timestamp: number;
  version: number;
}

// Client state management
class GameStateManager {
  private state: GameState;
  private version: number = 0;

  updateState(sync: GameStateSync) {
    if (sync.type === 'full') {
      this.state = sync.data as GameState;
    } else {
      this.state = { ...this.state, ...sync.data };
    }
    this.version = sync.version;
  }
}
```

### Error Handling Strategy

```typescript
// Error handling hierarchy
try {
  // Game action processing
  const result = await processPlayerAction(action);
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    return { error: 'Invalid action', code: 400 };
  } else if (error instanceof RuleViolationError) {
    return { error: 'Rule violation', code: 422 };
  } else if (error instanceof AIError) {
    return { error: 'AI service unavailable', code: 503 };
  } else {
    return { error: 'Internal server error', code: 500 };
  }
}
```

---

## Development Roadmap

### Phase 1: Core Completion (Weeks 1-4)

**Priority 1: LLM Integration**
- [ ] Implement proper API key management
- [ ] Add retry logic and error handling
- [ ] Create prompt templates for different scenarios
- [ ] Implement response validation and parsing
- [ ] Add streaming responses for better UX

**Priority 2: Rule Engine Enhancement**
- [ ] Complete skill check calculations with modifiers
- [ ] Implement damage calculation and healing
- [ ] Add status effect system
- [ ] Create spell/ability framework
- [ ] Implement inventory and item management

**Priority 3: Game State Persistence**
- [ ] Implement SQLite database integration
- [ ] Create save/load functionality
- [ ] Add game session management
- [ ] Implement state validation and migration

### Phase 2: Feature Enhancement (Weeks 5-8)

**UI/UX Improvements**
- [ ] Enhance mobile app interface
- [ ] Add animations and visual feedback
- [ ] Implement responsive design
- [ ] Create better map visualization
- [ ] Add accessibility features

**Advanced Game Features**
- [ ] Implement quest system
- [ ] Add NPC interaction mechanics
- [ ] Create dynamic world events
- [ ] Build campaign management tools
- [ ] Add voice interaction capabilities

**Testing & Quality**
- [ ] Increase test coverage to 70%+
- [ ] Add integration tests
- [ ] Implement E2E testing
- [ ] Add performance testing
- [ ] Create automated testing pipeline

### Phase 3: Platform Expansion (Weeks 9-12)

**AI Enhancement**
- [ ] Implement RAG (Retrieval Augmented Generation)
- [ ] Add AI-driven NPC personalities
- [ ] Implement adaptive difficulty
- [ ] Create content generation tools
- [ ] Add multi-language support

**Platform Features**
- [ ] Add web-based player interfaces
- [ ] Implement cloud save synchronization
- [ ] Create content creation tools
- [ ] Build community features
- [ ] Add mod support and marketplace

**Advanced Features**
- [ ] Implement multiplayer beyond 2 players
- [ ] Add campaign sharing system
- [ ] Implement analytics and metrics
- [ ] Create admin dashboard
- [ ] Add performance monitoring

---

## Quality Assurance & Testing

### Current Testing Status

**Test Coverage**: 8 test files for 88 TypeScript files (9% coverage)

**Existing Tests:**
- `backend-e2e/`: End-to-end tests for backend API
- `host-app-e2e/`: Playwright tests for host application
- Individual module tests: Basic unit tests for core modules

### Testing Strategy

**Unit Testing (Jest)**
```typescript
// Example test structure
describe('RuleEngine', () => {
  describe('performSkillCheck', () => {
    it('should return true when roll meets DC', () => {
      const character = createTestCharacter();
      const result = performSkillCheck(character, 'athletics', 15);
      expect(typeof result).toBe('boolean');
    });
  });
});
```

**Integration Testing**
```typescript
// Test service interactions
describe('GameSession Integration', () => {
  it('should process player action end-to-end', async () => {
    const session = await createTestSession();
    const action = { type: 'move', direction: 'north' };
    const result = await session.processAction(action);
    expect(result.success).toBe(true);
  });
});
```

**E2E Testing (Playwright)**
```typescript
// Test complete user workflows
test('character creation flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="create-character"]');
  await page.fill('[data-testid="character-name"]', 'Test Character');
  await page.click('[data-testid="submit-character"]');
  await expect(page.locator('[data-testid="character-sheet"]')).toBeVisible();
});
```

### Quality Metrics

**Code Quality Targets:**
- Test Coverage: 80%+
- TypeScript Strict Mode: Enabled
- ESLint Errors: 0
- Performance: < 100ms response time
- Accessibility: WCAG 2.1 AA compliance

**Monitoring & Metrics:**
- Error tracking and reporting
- Performance monitoring
- User behavior analytics
- Code quality metrics
- Security vulnerability scanning

---

## Conclusion

Chronicle Core represents a sophisticated and well-architected approach to AI-driven tabletop gaming. The project demonstrates excellent engineering practices with its modular design, comprehensive type system, and modern technology stack.

**Key Strengths:**
- Solid architectural foundation
- Clear separation of concerns
- Comprehensive data modeling
- Modern development practices
- Cross-platform compatibility

**Critical Path to Completion:**
1. Complete LLM integration with proper error handling
2. Enhance rule engine with full game mechanics
3. Implement game state persistence
4. Improve UI/UX across all platforms
5. Increase test coverage and quality assurance

The project is well-positioned to achieve its ambitious vision of revolutionizing tabletop gaming through AI integration while maintaining the fairness and consistency that players expect from traditional TTRPGs.

With focused development on the identified priorities, Chronicle Core has the potential to become a groundbreaking platform that bridges the gap between traditional tabletop gaming and modern AI technology.
