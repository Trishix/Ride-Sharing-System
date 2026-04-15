import { DriverRepository } from '../../domain/repositories/DriverRepository';
import { Driver } from '../../model/Driver';
import { Rider } from '../../model/Rider';
import { Trip } from '../../model/Trip';
import { TripStatus } from '../../model/TripStatus';
import { PostgresDatabase } from '../persistence/PostgresDatabase';

interface DriverRow {
  id: number;
  name: string;
  is_accepting_rider: boolean;
}

interface ActiveTripRow {
  trip_id: string;
  driver_id: number;
  rider_id: number;
  rider_name: string;
  origin: number;
  destination: number;
  seats: number;
  fare: number;
  status: string;
}

export class PostgresDriverRepository implements DriverRepository {
  constructor(private readonly db: PostgresDatabase) {}

  public async save(driver: Driver): Promise<void> {
    await this.db.query(
      `
        INSERT INTO drivers (id, name, is_accepting_rider)
        VALUES ($1, $2, $3)
        ON CONFLICT (id)
        DO UPDATE SET
          name = EXCLUDED.name,
          is_accepting_rider = EXCLUDED.is_accepting_rider
      `,
      [driver.getId(), driver.getName(), driver.getAcceptingRider()]
    );
  }

  public async update(driver: Driver): Promise<void> {
    await this.db.query(
      `
        UPDATE drivers
        SET name = $2, is_accepting_rider = $3
        WHERE id = $1
      `,
      [driver.getId(), driver.getName(), driver.getAcceptingRider()]
    );
  }

  public async findById(id: number): Promise<Driver | undefined> {
    const driverResult = await this.db.query<DriverRow>(
      'SELECT id, name, is_accepting_rider FROM drivers WHERE id = $1',
      [id]
    );

    if (driverResult.rows.length === 0) {
      return undefined;
    }

    const driverRow = driverResult.rows[0];
    const driver = new Driver(driverRow.id, driverRow.name);
    driver.setAcceptingRider(driverRow.is_accepting_rider);

    const activeTripResult = await this.db.query<ActiveTripRow>(
      `
        SELECT
          t.id AS trip_id,
          t.driver_id,
          t.rider_id,
          r.name AS rider_name,
          t.origin,
          t.destination,
          t.seats,
          t.fare,
          t.status
        FROM trips t
        JOIN riders r ON r.id = t.rider_id
        WHERE t.driver_id = $1 AND t.status = $2
        LIMIT 1
      `,
      [id, TripStatus.IN_PROGRESS]
    );

    if (activeTripResult.rows.length === 1) {
      const activeTrip = activeTripResult.rows[0];
      const rider = new Rider(activeTrip.rider_id, activeTrip.rider_name);
      const trip = Trip.fromPersistence(
        activeTrip.trip_id,
        rider,
        driver,
        activeTrip.origin,
        activeTrip.destination,
        activeTrip.seats,
        activeTrip.fare,
        this.toTripStatus(activeTrip.status)
      );
      driver.setCurrentTrip(trip);
    }

    return driver;
  }

  public async findAll(): Promise<Driver[]> {
    const driverResult = await this.db.query<DriverRow>(
      'SELECT id, name, is_accepting_rider FROM drivers ORDER BY id ASC'
    );

    const drivers = driverResult.rows.map((row) => {
      const driver = new Driver(row.id, row.name);
      driver.setAcceptingRider(row.is_accepting_rider);
      return driver;
    });

    if (drivers.length === 0) {
      return [];
    }

    const driverMap = new Map<number, Driver>(drivers.map((driver) => [driver.getId(), driver]));
    const driverIds = drivers.map((driver) => driver.getId());

    const activeTripResult = await this.db.query<ActiveTripRow>(
      `
        SELECT
          t.id AS trip_id,
          t.driver_id,
          t.rider_id,
          r.name AS rider_name,
          t.origin,
          t.destination,
          t.seats,
          t.fare,
          t.status
        FROM trips t
        JOIN riders r ON r.id = t.rider_id
        WHERE t.status = $1 AND t.driver_id = ANY($2::int[])
      `,
      [TripStatus.IN_PROGRESS, driverIds]
    );

    for (const row of activeTripResult.rows) {
      const driver = driverMap.get(row.driver_id);
      if (!driver) {
        continue;
      }

      const rider = new Rider(row.rider_id, row.rider_name);
      const trip = Trip.fromPersistence(
        row.trip_id,
        rider,
        driver,
        row.origin,
        row.destination,
        row.seats,
        row.fare,
        this.toTripStatus(row.status)
      );
      driver.setCurrentTrip(trip);
    }

    return drivers;
  }

  private toTripStatus(status: string): TripStatus {
    if (status === TripStatus.COMPLETED) {
      return TripStatus.COMPLETED;
    }

    if (status === TripStatus.WITHDRAWN) {
      return TripStatus.WITHDRAWN;
    }

    return TripStatus.IN_PROGRESS;
  }
}
