import { asyncStorageDb } from '@/bootstrap/async-storage-db';
import { ModuleEventsPull } from '@/bootstrap/di/module.events-pull';
import { POOL } from '@/bootstrap/di/module.shared';
import { IDomainEvent } from '@/core/domain/event/domain.event';
import { EventBus } from '@/infrastructure/incoming/event-internal/event.bus';
import { ServiceMessenger } from '@/infrastructure/outgoing/http/service.messenger';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'mysql2/promise';

describe('Operator (e2e)', () => {
  let app: INestApplication;

  let eventBus: EventBus;

  let pool: Pool;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ModuleEventsPull],
    }).compile();

    app = moduleFixture.createNestApplication();
    eventBus = app.get(EventBus);
    pool = app.get(POOL) as Pool;

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Decision triggered by rouletteTurnedOn event', async () => {
    const serviceMessenger = app.get(ServiceMessenger);
    serviceMessenger.getDecisionDemandList = (tenantId: string) => {
      return Promise.resolve([
        {
          tenantId: '283',
          callId: 'call456',
          visitorId: 'visitor1234',
          createdOn: new Date('2023-04-09 21:30:00'),
          operators: ['operator123', 'operator345'],
        },
        {
          tenantId: '283',
          callId: 'call789',
          visitorId: 'visitor1234',
          createdOn: new Date('2023-04-09 21:20:00'),
          operators: ['operator123', 'operator345'],
        },
      ]);
    };

    await asyncStorageDb.run(pool.getConnection(), async () => {
      return await eventBus.direct<IDomainEvent<'Tenant', 'rouletteTurnedOn'>>({
        tenantId: '283',
        entityId: '283',
        entityType: 'Tenant',
        type: 'rouletteTurnedOn',
        occurredOn: new Date('2023-04-09 02:30:00'),
        payloadVersion: 1,
        payload: {},
      });
    });

    const connection = await pool.getConnection();

    const res = await connection.query('SELECT * FROM events WHERE tenant_id = "283" AND entity_type = "Operator"', {});
    expect(res[0]).toEqual([
      {
        entity_id: 'operator345',
        entity_type: 'Operator',
        id: expect.any(Number),
        occurred_on: new Date('2023-04-09 02:30:00'),
        payload: {callId: 'call789'},
        payload_version: 1,
        tenant_id: '283',
        type: 'callAssigned',
      },
      {
        entity_id: 'operator345',
        entity_type: 'Operator',
        id: expect.any(Number),
        occurred_on: new Date('2023-04-09 02:30:00'),
        payload: {callId: 'call456'},
        payload_version: 1,
        tenant_id: '283',
        type: 'callAssigned',
      },
    ]);
  });
});
