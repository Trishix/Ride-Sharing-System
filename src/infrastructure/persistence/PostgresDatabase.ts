import { Pool, QueryResult, QueryResultRow } from 'pg';

export class PostgresDatabase {
  private static instance: PostgresDatabase | null = null;
  private readonly pool: Pool;

  private constructor(private readonly connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=disable')
        ? undefined
        : { rejectUnauthorized: false }
    });
  }

  public static getInstance(connectionString: string): PostgresDatabase {
    if (!PostgresDatabase.instance) {
      PostgresDatabase.instance = new PostgresDatabase(connectionString);
    }

    return PostgresDatabase.instance;
  }

  public async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params: unknown[] = []
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  public async initializeSchema(): Promise<void> {
    await this.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        is_accepting_rider BOOLEAN NOT NULL DEFAULT TRUE
      )
    `);

    await this.query(`
      CREATE TABLE IF NOT EXISTS riders (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    await this.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
        driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
        origin INTEGER NOT NULL,
        destination INTEGER NOT NULL,
        seats INTEGER NOT NULL,
        fare DOUBLE PRECISION NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.query(`
      CREATE INDEX IF NOT EXISTS idx_trips_rider_id ON trips(rider_id)
    `);

    await this.query(`
      CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips(driver_id)
    `);

    await this.query(`
      CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status)
    `);
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}
