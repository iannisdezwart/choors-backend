export type EndToEndFlow = {
  name: string;
  fn: () => Promise<void>;
}