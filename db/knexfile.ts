import type { Knex } from 'knex';

const host = process.env['DB_HOST'] as string;
const port = parseInt(process.env['DB_PORT'] as string);
const database = process.env['DB_NAME'] as string;
const user = process.env['DB_USER'] as string;
const password = process.env['DB_PASSWORD'] as string;
const config: { [key: string]: Knex.Config } = {
  default: {
    client: 'mysql2',
    connection: {
      host,
      port,
      database,
      user,
      password,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};

module.exports = config.default;
