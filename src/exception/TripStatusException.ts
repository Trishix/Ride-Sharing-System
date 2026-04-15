export class TripStatusException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TripStatusException';
  }
}
