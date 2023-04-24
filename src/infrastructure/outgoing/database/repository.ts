import { ErrorInfrastructure } from '@/infrastructure/error/error.infrastructure';
import { AsyncLocalStorage } from 'async_hooks';
import { PoolConnection } from 'mysql2/promise';

export abstract class Repository {
  constructor(protected readonly asyncStorage: AsyncLocalStorage<Promise<PoolConnection>>) {}

  protected getConnection(): Promise<PoolConnection> {
    const connection = this.asyncStorage.getStore();
    if (connection === undefined) {
      throw new ErrorInfrastructure('Unable get connection');
    }
    return connection;
  }
}
