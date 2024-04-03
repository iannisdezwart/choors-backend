import { CustomTimeProvider } from "../../../utils/time-provider/CustomTimeProvider";

export type EndToEndFlow = {
  name: string;
  fn: (timeProvider: CustomTimeProvider) => Promise<void>;
}