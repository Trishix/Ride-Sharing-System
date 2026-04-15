import { randomUUID } from 'crypto';
import { Driver } from './Driver';
import { Rider } from './Rider';
import { TripStatus } from './TripStatus';

export class Trip {
  private id: string;
  private readonly rider: Rider;
  private readonly driver: Driver;
  private origin: number;
  private destination: number;
  private seats: number;
  private fare: number;
  private status: TripStatus;

  constructor(
    rider: Rider,
    driver: Driver,
    origin: number,
    destination: number,
    seats: number,
    fare: number
  ) {
    this.id = randomUUID();
    this.rider = rider;
    this.driver = driver;
    this.origin = origin;
    this.destination = destination;
    this.seats = seats;
    this.fare = fare;
    this.status = TripStatus.IN_PROGRESS;
  }

  public getId(): string {
    return this.id;
  }

  public getRider(): Rider {
    return this.rider;
  }

  public getDriver(): Driver {
    return this.driver;
  }

  public getFare(): number {
    return this.fare;
  }

  public getOrigin(): number {
    return this.origin;
  }

  public getDestination(): number {
    return this.destination;
  }

  public getSeats(): number {
    return this.seats;
  }

  public getStatus(): TripStatus {
    return this.status;
  }

  public updateTrip(origin: number, destination: number, seats: number, fare: number): void {
    this.origin = origin;
    this.destination = destination;
    this.seats = seats;
    this.fare = fare;
  }

  public endTrip(): void {
    this.status = TripStatus.COMPLETED;
  }

  public withdrawTrip(): void {
    this.status = TripStatus.WITHDRAWN;
  }

  public static fromPersistence(
    id: string,
    rider: Rider,
    driver: Driver,
    origin: number,
    destination: number,
    seats: number,
    fare: number,
    status: TripStatus
  ): Trip {
    const trip = new Trip(rider, driver, origin, destination, seats, fare);
    trip.id = id;
    trip.status = status;
    return trip;
  }
}
