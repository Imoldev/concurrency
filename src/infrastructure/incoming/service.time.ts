export class ServiceTime {
  private fakeDate: Date | null = null;

  setFake(fakeDate: Date) {
    this.fakeDate = fakeDate;
  }

  getNow(): Date {
    if (this.fakeDate !== null) {
      return this.fakeDate;
    }
    return new Date();
  }
}
