import { Trip } from '../../model/Trip';

export interface TripRepository {
  save(riderId: number, trip: Trip): Promise<void>;
  update(trip: Trip): Promise<void>;
  findById(tripId: string): Promise<Trip | undefined>;
  findByRiderId(riderId: number): Promise<Trip[]>;
}
