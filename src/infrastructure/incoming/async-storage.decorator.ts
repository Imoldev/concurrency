/* eslint-disable */
import { asyncStorageDb } from '@/bootstrap/async-storage-db';
import { pool } from '@/bootstrap/pool';
import { PoolConnection } from 'mysql2/promise';

/**
 * Декоратор Асинхронной транзакции.
 * Для использования в командах
 *
 * Декоратор метода (TS - декоратор)
 * Обеспечивает изоляцию коннекта к БД внутри цепочки
 * асинхронных вызовов, доступ изнутри цепочки к этому коннекту
 * посредством  getStore().
 * Так же обеспечивается старт и откат транзакции, в случае ошибки
 *
 */
export function AsyncDbTransactional() {
  return (target: object, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
    let result;
    const method = descriptor.value!;
    descriptor.value = async function (...args) {
      await asyncStorageDb.run(pool.getConnection(), async () => {
        const connection = (await asyncStorageDb.getStore()) as PoolConnection;

        await connection.beginTransaction();
        try {
          result = await method.apply(this, args);
          await connection.commit();
        } catch (e) {
          await connection.rollback();
          throw e;
        } finally {
          await connection.release();
        }
      });
      return result;
    };
  };
}

/**
 * Декоратор Асинхронного доступа к коннекту базы.
 * Для использования в запросах
 *
 * Декоратор метода (TS - декоратор)
 * Обеспечивает изоляцию коннекта к БД внутри цепочки
 * асинхронных вызовов, доступ изнутри цепочки к этому коннекту
 * посредством  getStore().
 * Старта и отката транзакции не происходит
 *
 */
export function AsyncDb() {
  return (target: object, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
    let result;
    const method = descriptor.value!;
    descriptor.value = async function (...args) {
      await asyncStorageDb.run(pool.getConnection(), async () => {
        const connection = (await asyncStorageDb.getStore()) as PoolConnection;
        try {
          result = await method.apply(this, args);
          return result;
        } catch (e) {
          throw e;
        } finally {
          await connection.release();
        }
      });
      return result;
    };
  };
}
