export interface IScheduler {
  start(): void;

  stop(): void;

  run(): Promise<void>;
}
