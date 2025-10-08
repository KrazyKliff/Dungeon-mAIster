import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { GameState } from '@dungeon-maister/data-models';

const DATABASE_FILE = 'db.sqlite';

export class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DATABASE_FILE, (err) => {
      if (err) {
        console.error('Error opening database', err);
      } else {
        console.log('Database connected');
        this.init();
      }
    });
  }

  private init() {
    const schemaPath = path.join(__dirname, '..', '..' , 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    this.db.exec(schema, (err) => {
      if (err) {
        console.error('Error initializing database schema', err);
      } else {
        console.log('Database schema initialized');
      }
    });
  }

  public saveGameSession(id: string, name: string, gameState: GameState): Promise<void> {
    return new Promise((resolve, reject) => {
      const serializedState = JSON.stringify(gameState);
      this.db.run(
        'INSERT OR REPLACE INTO game_sessions (id, name, game_state) VALUES (?, ?, ?)',
        [id, name, serializedState],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  public loadGameSession(id: string): Promise<GameState | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT game_state FROM game_sessions WHERE id = ?',
        [id],
        (err, row: { game_state: string }) => {
          if (err) {
            reject(err);
          } else {
            if (row) {
              const gameState = JSON.parse(row.game_state);
              resolve(gameState);
            } else {
              resolve(null);
            }
          }
        }
      );
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }
}