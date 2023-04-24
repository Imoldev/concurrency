import { ModuleApp } from '@/bootstrap/di/module.app';
import { ServiceTime } from '@/infrastructure/incoming/service.time';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('Operator (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ModuleApp],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Create new Operator', async () => {
    const timeService = app.get(ServiceTime);
    timeService.setFake(new Date('2023-03-20 16:00'));

    const server = await request(app.getHttpServer());

    const response = server
      .post('/api/v1/tenant/283/operator/operator789-87-232')
      .send({
        limit: 25,
      })
      .set('actorId', 'operator444449')
      .set('role', 'employee')
      .set('Content-type', 'application/json; charset=utf-8');

    const result = await response;
    expect(result.status).toEqual(201);
  });

  it('Change limit', async () => {
    const timeService = app.get(ServiceTime);
    timeService.setFake(new Date('2023-03-21 09:00'));

    const server = await request(app.getHttpServer());

    const response = server
      .patch('/api/v1/tenant/283/operator/operator789-87-232/limit')
      .send({
        limit: 8,
      })
      .set('actorId', 'operator444449')
      .set('role', 'employee')
      .set('Content-type', 'application/json; charset=utf-8');

    const result = await response;
    expect(result.status).toEqual(200);
  });

  it('Accept Call', async () => {
    const timeService = app.get(ServiceTime);
    timeService.setFake(new Date('2023-03-22 14:40'));

    const server = await request(app.getHttpServer());

    const response = server
      .post('/api/v1/tenant/283/operator/operator789-87-232/call/call-6786-989')
      .set('Content-type', 'application/json; charset=utf-8');

    const result = await response;
    expect(result.status).toEqual(201);
  });

  it('Get Operator', async () => {
    const server = await request(app.getHttpServer());

    const response = server
      .get('/api/v1/tenant/283/operator/operator789-87-232')
      .set('Content-type', 'application/json; charset=utf-8');

    const result = await response;
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      id: 'operator789-87-232',
      tenantId: '283',
      limit: 8,
      slotsCount: 1,
      status: 'active',
      statusDate: new Date('2023-03-20 16:00').toISOString(),
    });
  });

  it('Get Operator list', async () => {
    const server = await request(app.getHttpServer());

    const response = server
      .get('/api/v1/tenant/283/operator?id_list=operator789-87-232&id_list=operator789-87-444')
      .set('Content-type', 'application/json; charset=utf-8');

    const result = await response;
    expect(result.status).toEqual(200);
    expect(result.body).toEqual([
      {
        id: 'operator789-87-232',
        tenantId: '283',
        limit: 8,
        slotsCount: 1,
        status: 'active',
        statusDate: new Date('2023-03-20 16:00').toISOString(),
      },
    ]);
  });

  it('Accept Transfer', async () => {
    const timeService = app.get(ServiceTime);
    timeService.setFake(new Date('2023-03-22 14:40'));

    const server = await request(app.getHttpServer());

    const response = server
      .post('/api/v1/tenant/283/operator/operator789-87-232/consultation/consultation80-35/transfer/transfer09809-789')
      .set('Content-type', 'application/json; charset=utf-8');

    const result = await response;
    expect(result.status).toEqual(201);
  });
});
