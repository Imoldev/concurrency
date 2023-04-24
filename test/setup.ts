import { pool } from '@/bootstrap/pool';

// beforeAll(() => {});
afterAll(() => {
  pool.end();
});
