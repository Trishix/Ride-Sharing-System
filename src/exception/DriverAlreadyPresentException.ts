export class DriverAlreadyPresentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DriverAlreadyPresentException';
  }
}
