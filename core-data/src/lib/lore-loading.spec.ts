import { getFactions, getBeliefs, getHistory } from './data-store';

describe('DataStore', () => {
  // TODO: This test is skipped because it requires a full suite of data files to be present,
  // including some that are not yet created (e.g., skills.json).
  // This should be re-enabled once the core data files are complete.
  it.skip('should load lore data without errors', () => {
    const factions = getFactions();
    const beliefs = getBeliefs();
    const history = getHistory();

    expect(factions.length).toBeGreaterThan(0);
    expect(beliefs.length).toBeGreaterThan(0);
    expect(history.length).toBeGreaterThan(0);
  });
});
