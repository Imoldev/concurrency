import { IDomainEventBase } from '@/core/domain/event/domain.event';

type EventsTable = {
  id: bigint;
  type: string;
  tenant_id: string;
  entity_type: string;
  entity_id: string;
  occurred_on: Date;
  payload_version: number;
  payload: string;
};

export function hydrate(event: EventsTable): IDomainEventBase {
  const { id, type, tenant_id, entity_type, entity_id, occurred_on, payload } = event;
  return {
    id: BigInt(id.toString()),
    type,
    tenantId: tenant_id,
    entityId: entity_id,
    entityType: entity_type,
    occurredOn: occurred_on,
    payloadVersion: 1,
    payload,
  };
}

export function isEventsTable(datum: any): datum is EventsTable {
  //todo реализовать
  return true;
}
