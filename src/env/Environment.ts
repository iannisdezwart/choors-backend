export type Environment = {
  apiPort: number;
  jwtSecret: string;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  pictureStoragePath: string;
  pictureMaxSize: number;
  schedulerInterval: number;
};
