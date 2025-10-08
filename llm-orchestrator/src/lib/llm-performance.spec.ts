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

describe('LlmOrchestratorService Performance', () => {
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

  it('should have an average narrative generation time below 2 seconds', async () => {
    const iterations = 10;
    const responseTimes: number[] = [];
    const context = {
      gameState: { characters: {} } as GameState,
      command: 'test command',
      activeEvents: [],
      currentLocation: null,
    };

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      const delay = Math.random() * 1500 + 500; // Simulate 500ms to 2000ms response time

      (askAI as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve('Test response'), delay))
      );

      await service.generateNarrative(context);

      const endTime = Date.now();
      responseTimes.push(endTime - startTime);
    }

    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / iterations;
    console.log(`Average narrative generation time: ${averageResponseTime.toFixed(2)}ms`);

    expect(averageResponseTime).toBeLessThan(2000);
  }, 30000); // 30 second timeout for this test
});
