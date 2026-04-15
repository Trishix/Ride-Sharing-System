export class Rider {
  constructor(private id: number, private name: string) {}

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
