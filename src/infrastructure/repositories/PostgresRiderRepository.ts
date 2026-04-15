import { RiderRepository } from '../../domain/repositories/RiderRepository';
import { Rider } from '../../model/Rider';
import { PostgresDatabase } from '../persistence/PostgresDatabase';

interface RiderRow {
  id: number;
  name: string;
}

export class PostgresRiderRepository implements RiderRepository {
  constructor(private readonly db: PostgresDatabase) {}

  public async save(rider: Rider): Promise<void> {
    await this.db.query(
      `
        INSERT INTO riders (id, name)
        VALUES ($1, $2)
        ON CONFLICT (id)
        DO UPDATE SET name = EXCLUDED.name
      `,
      [rider.getId(), rider.getName()]
    );
  }

  public async findById(id: number): Promise<Rider | undefined> {
    const result = await this.db.query<RiderRow>('SELECT id, name FROM riders WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return undefined;
    }

    const row = result.rows[0];
    return new Rider(row.id, row.name);
  }
}
