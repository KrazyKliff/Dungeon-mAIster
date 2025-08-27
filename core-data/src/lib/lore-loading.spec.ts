import { DataAccessService } from './data-access.service';
import * as path from 'path';

describe('DataAccessService', () => {
  it('should load lore data without errors', () => {
    const assetPath = path.join(__dirname, '..', 'lib');
    const dataAccessService = new DataAccessService(assetPath);
    expect(dataAccessService).toBeDefined();
    expect(dataAccessService.getFactions().length).toBeGreaterThan(0);
    expect(dataAccessService.getBeliefs().length).toBeGreaterThan(0);
    expect(dataAccessService.getHistory().length).toBeGreaterThan(0);
  });
});
