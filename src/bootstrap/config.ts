import { fetchBoolean, fetchOneOfEnabled, fetchPositiveNonZeroInt, fetchString } from './utils';

type ServerConfig = {
  serverPort: number;
};

type DatabaseConfig = {
  host: string;
  password: string;
  user: string;
  name: string;
  port: number;
  connectionLimit: number;
};

export type Config = {
  nodeEnv: 'development' | 'production';
  server: ServerConfig;
  database: DatabaseConfig;
};

export const config: Config = {
  nodeEnv: fetchOneOfEnabled('NODE_ENV', ['development', 'production']),
  server: {
    serverPort: fetchPositiveNonZeroInt('SERVER_PORT'),
  },
  database: {
    host: fetchString('DB_HOST'),
    password: fetchString('DB_PASSWORD'),
    user: fetchString('DB_USER'),
    name: fetchString('DB_NAME'),
    port: fetchPositiveNonZeroInt('DB_PORT'),
    connectionLimit: fetchPositiveNonZeroInt('DB_CONNECTIONS_LIMIT'),
  },
};
