export class RiderAlreadyPresentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RiderAlreadyPresentException';
  }
}
