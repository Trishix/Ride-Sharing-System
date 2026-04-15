import { Trip } from './Trip';

export class Driver {
  private currentTrip: Trip | null = null;
  private isAcceptingRider = true;

  constructor(private id: number, private readonly name: string) {}

  public getId(): number {
    return this.id;
  }

  public getCurrentTrip(): Trip | null {
    return this.currentTrip;
  }

  public getName(): string {
    return this.name;
  }

  public getAcceptingRider(): boolean {
    return this.isAcceptingRider;
  }

  public setCurrentTrip(currentTrip: Trip | null): void {
    this.currentTrip = currentTrip;
  }

  public setAcceptingRider(isAcceptingRider: boolean): void {
    if (typeof isAcceptingRider !== 'boolean') {
      throw new Error('Driver availability must be boolean.');
    }

    this.isAcceptingRider = isAcceptingRider;
  }

  public isAvailable(): boolean {
    return this.isAcceptingRider && this.currentTrip === null;
  }
}
