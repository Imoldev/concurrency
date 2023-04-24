import { AsyncLocalStorage } from 'async_hooks';
import { PoolConnection } from 'mysql2/promise';

import { StoreEventInterface } from '@/core/app-service/interfaces/store.event.interface';
import { IDomainEventBase } from '@/core/domain/event/domain.event';
import { ErrorInfrastructure } from '@/infrastructure/error/error.infrastructure';

export class StoreEvent implements StoreEventInterface {
  constructor(private readonly asyncStorage: AsyncLocalStorage<Promise<PoolConnection>>) {}

  async save(events: IDomainEventBase[]): Promise<void> {
    const connection = await this.asyncStorage.getStore();

    if (connection === undefined) {
      throw new ErrorInfrastructure('Unable get connection');
    }

    const eventsTableQuery = 'INSERT INTO events SET :values';

    const dataEvents = dehydrate(events);

    const batch: any[] = [];
    dataEvents.forEach((eventsTable) => {
      batch.push(connection.query(eventsTableQuery, { values: eventsTable }));
    });

    await Promise.all(batch);
  }
}

function dehydrate(events: IDomainEventBase[]): EventsTable[] {
  const dataEvents: EventsTable[] = [];

  events.forEach((event) => {
    dataEvents.push({
      type: event.type as string,
      tenant_id: event.tenantId,
      entity_type: event.entityType,
      entity_id: event.entityId,
      occurred_on: event.occurredOn,
      payload_version: event.payloadVersion,
      payload: JSON.stringify(event.payload),
    });
  });

  return dataEvents;
}

type EventsTable = {
  type: string;
  tenant_id: string;
  entity_type: string;
  entity_id: string;
  occurred_on: Date;
  payload_version: number;
  payload: string;
};
