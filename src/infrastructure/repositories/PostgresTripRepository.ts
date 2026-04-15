import { TripRepository } from '../../domain/repositories/TripRepository';
import { Driver } from '../../model/Driver';
import { Rider } from '../../model/Rider';
import { Trip } from '../../model/Trip';
import { TripStatus } from '../../model/TripStatus';
import { PostgresDatabase } from '../persistence/PostgresDatabase';

interface TripRow {
  trip_id: string;
  rider_id: number;
  rider_name: string;
  driver_id: number;
  driver_name: string;
  driver_accepting_rider: boolean;
  origin: number;
  destination: number;
  seats: number;
  fare: number;
  status: string;
}

export class PostgresTripRepository implements TripRepository {
  constructor(private readonly db: PostgresDatabase) {}

  public async save(riderId: number, trip: Trip): Promise<void> {
    await this.db.query(
      `
        INSERT INTO trips (id, rider_id, driver_id, origin, destination, seats, fare, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        trip.getId(),
        riderId,
        trip.getDriver().getId(),
        trip.getOrigin(),
        trip.getDestination(),
        trip.getSeats(),
        trip.getFare(),
        trip.getStatus()
      ]
    );
  }

  public async update(trip: Trip): Promise<void> {
    await this.db.query(
      `
        UPDATE trips
        SET
          rider_id = $2,
          driver_id = $3,
          origin = $4,
          destination = $5,
          seats = $6,
          fare = $7,
          status = $8,
          updated_at = NOW()
        WHERE id = $1
      `,
      [
        trip.getId(),
        trip.getRider().getId(),
        trip.getDriver().getId(),
        trip.getOrigin(),
        trip.getDestination(),
        trip.getSeats(),
        trip.getFare(),
        trip.getStatus()
      ]
    );
  }

  public async findById(tripId: string): Promise<Trip | undefined> {
    const result = await this.db.query<TripRow>(
      `
        SELECT
          t.id AS trip_id,
          t.rider_id,
          r.name AS rider_name,
          t.driver_id,
          d.name AS driver_name,
          d.is_accepting_rider AS driver_accepting_rider,
          t.origin,
          t.destination,
          t.seats,
          t.fare,
          t.status
        FROM trips t
        JOIN riders r ON r.id = t.rider_id
        JOIN drivers d ON d.id = t.driver_id
        WHERE t.id = $1
      `,
      [tripId]
    );

    if (result.rows.length === 0) {
      return undefined;
    }

    return this.mapTrip(result.rows[0]);
  }

  public async findByRiderId(riderId: number): Promise<Trip[]> {
    const result = await this.db.query<TripRow>(
      `
        SELECT
          t.id AS trip_id,
          t.rider_id,
          r.name AS rider_name,
          t.driver_id,
          d.name AS driver_name,
          d.is_accepting_rider AS driver_accepting_rider,
          t.origin,
          t.destination,
          t.seats,
          t.fare,
          t.status
        FROM trips t
        JOIN riders r ON r.id = t.rider_id
        JOIN drivers d ON d.id = t.driver_id
        WHERE t.rider_id = $1
        ORDER BY t.created_at ASC
      `,
      [riderId]
    );

    return result.rows.map((row) => this.mapTrip(row));
  }

  private mapTrip(row: TripRow): Trip {
    const rider = new Rider(row.rider_id, row.rider_name);
    const driver = new Driver(row.driver_id, row.driver_name);
    driver.setAcceptingRider(row.driver_accepting_rider);

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

    if (trip.getStatus() === TripStatus.IN_PROGRESS) {
      driver.setCurrentTrip(trip);
    }

    return trip;
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
