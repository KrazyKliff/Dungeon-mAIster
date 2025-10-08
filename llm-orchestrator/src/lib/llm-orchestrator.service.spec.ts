import { Test, TestingModule } from '@nestjs/testing';
import { LlmOrchestratorService } from './llm-orchestrator.service';
import { askAI } from './llm.service';
import { GameState } from '@dungeon-maister/data-models';
import { CoreDataService } from '@dungeon-maister/core-data';

// Mock the external askAI function
jest.mock('./llm.service.ts', () => ({
  askAI: jest.fn(),
}));

const mockCoreDataService = {
  getFactions: () => [],
  getBeliefs: () => [],
  getHistory: () => [],
};

describe('LlmOrchestratorService', () => {
  let service: LlmOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmOrchestratorService,
        {
          provide: CoreDataService,
          useValue: mockCoreDataService,
        },
      ],
    }).compile();

    service = module.get<LlmOrchestratorService>(LlmOrchestratorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateNarrative', () => {
    const context = {
      gameState: { characters: {} } as GameState,
      command: 'look around',
      activeEvents: [],
      currentLocation: null,
    };

    it('should return a trimmed narrative from the AI', async () => {
      const aiResponse = '  This is a test narrative.  ';
      (askAI as jest.Mock).mockResolvedValue(aiResponse);

      const result = await service.generateNarrative(context);

      expect(result).toBe('This is a test narrative.');
      expect(askAI).toHaveBeenCalledTimes(1);
    });

    it('should return a fallback message if the AI fails', async () => {
      (askAI as jest.Mock).mockRejectedValue(new Error('AI Error'));

      const result = await service.generateNarrative(context);

      expect(result).toContain('The AI Game Master is currently unavailable.');
    });

    it('should return a fallback message if the AI response is empty', async () => {
      (askAI as jest.Mock).mockResolvedValue('');

      const result = await service.generateNarrative(context);

      expect(result).toContain('The AI Game Master is currently unavailable.');
    });
  });

  describe('generateMapParameters', () => {
    it('should return parsed and validated map parameters on success', async () => {
      const aiResponse = JSON.stringify({
        propDensity: 'high',
        enemyCount: 8,
        propThemes: ['a', 'b'],
      });
      (askAI as jest.Mock).mockResolvedValue(aiResponse);

      const result = await service.generateMapParameters('test');

      expect(result).toEqual({
        propDensity: 'high',
        enemyCount: 8,
        propThemes: ['a', 'b'],
      });
    });

    it('should return default parameters if the AI fails', async () => {
      (askAI as jest.Mock).mockRejectedValue(new Error('AI Error'));

      const result = await service.generateMapParameters('test');

      expect(result).toEqual({
        propDensity: 'medium',
        enemyCount: 5,
        propThemes: ['test', 'mysterious', 'ancient'],
      });
    });

    it('should return default parameters if the AI returns invalid JSON', async () => {
      (askAI as jest.Mock).mockResolvedValue('not json');

      const result = await service.generateMapParameters('test');

      expect(result).toEqual({
        propDensity: 'medium',
        enemyCount: 5,
        propThemes: ['test', 'mysterious', 'ancient'],
      });
    });

    it('should correctly parse JSON wrapped in other text', async () => {
        const aiResponse = 'Here is the JSON: `{"propDensity": "low", "enemyCount": 2, "propThemes": ["c"]}`';
        (askAI as jest.Mock).mockResolvedValue(aiResponse);
  
        const result = await service.generateMapParameters('test');
  
        expect(result).toEqual({
          propDensity: 'low',
          enemyCount: 2,
          propThemes: ['c'],
        });
      });
  });
});