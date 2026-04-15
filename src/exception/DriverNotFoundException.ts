export class DriverNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DriverNotFoundException';
  }
}
