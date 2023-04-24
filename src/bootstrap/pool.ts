import { createPool, Pool } from 'mysql2/promise';
import { config } from './config';

const { database } = config;

export const pool: Pool = createPool({
  connectionLimit: database.connectionLimit,
  host: database.host,
  port: database.port,
  password: database.password,
  database: database.name,
  user: database.user,
  namedPlaceholders: true,
});

if (config.nodeEnv === 'development') {
  pool.on('acquire', (connection) => {
    console.log('Connection %d acquired', connection.threadId);
  });

  pool.on('connection', (connection) => {
    console.log('Connection %d', connection.threadId);
  });

  pool.on('enqueue', () => {
    console.log('Waiting for available connection slot');
  });

  pool.on('release', (connection) => {
    console.log('Connection %d released', connection.threadId);
  });
}
