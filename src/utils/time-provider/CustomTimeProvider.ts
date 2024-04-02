import { ITimeProvider } from "./ITimeProvider";

export class CustomTimeProvider implements ITimeProvider {
  private time: number;

  constructor(date: Date) {
    this.time = date.getTime();
  }

  now() {
    return this.time;
  }
}
