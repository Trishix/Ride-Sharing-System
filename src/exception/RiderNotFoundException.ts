export class RiderNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RiderNotFoundException';
  }
}
