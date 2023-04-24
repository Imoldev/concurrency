import { ErrorActionRepeat } from '@/core/domain/errors/error.action.repeat';
import { IDomainEventBase } from '@/core/domain/event/domain.event';
import { ErrorInfrastructure } from '@/infrastructure/error/error.infrastructure';
import { AsyncLocalStorage } from 'async_hooks';
import { PoolConnection } from 'mysql2/promise';
import { AsyncDbTransactional } from '../../async-storage.decorator';
import { hydrate, isEventsTable } from './translator';

export type EventBusFunction = (event: IDomainEventBase) => Promise<void>;

export class ServiceEventsPulling {
  private readonly logger;

  private readonly acceptableErrors: Set<any> = new Set([ErrorActionRepeat]);

  constructor(
    private readonly eventBus: EventBusFunction,
    private readonly asyncStorage: AsyncLocalStorage<Promise<PoolConnection>>,
  ) {
    this.logger = console;
  }

  @AsyncDbTransactional()
  public async pullEvent() {
    const queryEvent = 'SELECT * FROM events ORDER BY id ASC LIMIT 1 FOR UPDATE';
    const queryEventDelete = 'DELETE FROM events WHERE id = :id';

    const queryEventsHandledInsert = 'INSERT INTO events_handled SET :values';

    const connect = await this.asyncStorage.getStore();
    if (connect === undefined) {
      throw new ErrorInfrastructure('Unable get connection');
    }

    const result = await connect.query(queryEvent);
    const datum = result[0][0];

    if (datum === undefined) {
      this.logger.debug('Not found Event for handling');
      return;
    }

    if (!isEventsTable(datum)) {
      throw new ErrorInfrastructure(`Unexpected data for event ${datum}`);
    }

    const event = hydrate(datum);

    try {
      await this.eventBus(event);
    } catch (e) {
      if (this.isErrorAcceptable(e)) {
        this.logger.warn('Acceptable error', e.message);
      } else {
        this.logger.error(e.message);
        throw e;
      }
    }

    const eventHandledRow: EventHandledTable = {
      id: event.id!,
      type: event.type,
      tenant_id: event.tenantId,
      entity_type: event.entityType,
      entity_id: event.entityId,
      occurred_on: event.occurredOn,
      payload_version: event.payloadVersion,
      payload: JSON.stringify(event.payload),
      handled_on: new Date(),
    };

    await Promise.all([
      connect.query(queryEventDelete, { id: event.id }),
      connect.query(queryEventsHandledInsert, { values: eventHandledRow }),
    ]);
  }

  private isErrorAcceptable(e: Error): boolean {
    const errorType = e.constructor;
    return this.acceptableErrors.has(errorType);
  }
}

type EventHandledTable = {
  id: bigint;
  type: string;
  tenant_id: string;
  entity_type: string;
  entity_id: string;
  occurred_on: Date;
  payload_version: number;
  payload: string;
  handled_on: Date;
};
