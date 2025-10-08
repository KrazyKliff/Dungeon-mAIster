CREATE TABLE IF NOT EXISTS game_sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  game_state TEXT NOT NULL
);
