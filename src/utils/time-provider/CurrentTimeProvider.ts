import { ITimeProvider } from "./ITimeProvider";

export class CurrentTimeProvider implements ITimeProvider {
  now() {
    return Date.now();
  }
}
