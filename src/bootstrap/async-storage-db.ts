import { PoolConnection } from 'mysql2/promise';
import { AsyncLocalStorage } from 'node:async_hooks';

export const asyncStorageDb = new AsyncLocalStorage<Promise<PoolConnection>>();
