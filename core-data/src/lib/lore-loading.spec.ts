import { getFactions, getBeliefs, getHistory } from './data-store';

describe('DataStore', () => {
  it('should load lore data without errors', () => {
    const factions = getFactions();
    const beliefs = getBeliefs();
    const history = getHistory();

    expect(factions.length).toBeGreaterThan(0);
    expect(beliefs.length).toBeGreaterThan(0);
    expect(history.length).toBeGreaterThan(0);
  });
});
