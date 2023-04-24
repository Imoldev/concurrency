import { ModuleApp } from '@/bootstrap/di/module.app';
import { POOL } from '@/bootstrap/di/module.shared';
import { ServiceTime } from '@/infrastructure/incoming/service.time';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'mysql2/promise';
import * as request from 'supertest';

describe('Tenant (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ModuleApp],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Tenant creation', () => {
    it('Create Tenant', async () => {
      const server = app.getHttpServer();

      const response = await request(server).post('/api/v1/tenant/283').send({
        mode: 'off',
      });

      expect(response.statusCode).toEqual(201);
    });

    it('Get created Tenant', async () => {
      const server = app.getHttpServer();
      const response = await request(server).get('/api/v1/tenant/283');

      expect(response.statusCode).toEqual(200);

      expect(response.body).toEqual({
        mode: 'off',
        modificationOn: null,
        tenantId: '283',
      });
    });
  });

  describe('Change mode', () => {
    it('Change mode request', async () => {
      const server = app.getHttpServer();
      const timeService = app.get(ServiceTime);
      timeService.setFake(new Date('2023-03-31 15:30:00'));

      const response = await request(server).patch('/api/v1/tenant/283').send({
        mode: 'basic',
      });

      expect(response.statusCode).toEqual(200);
    });

    it('Get changed tenant', async () => {
      const server = app.getHttpServer();
      const response = await request(server).get('/api/v1/tenant/283');

      expect(response.statusCode).toEqual(200);

      expect(response.body).toEqual({
        mode: 'basic',
        modificationOn: new Date('2023-03-31 15:30:00').toISOString(),
        tenantId: '283',
      });
    });

    it('Check event', async () => {
      const pool = app.get(POOL) as Pool;
      const connection = await pool.getConnection();

      const res = await connection.query('SELECT * FROM events WHERE entity_id = "283" AND entity_type = "Tenant"', {});

      expect(res[0]).toEqual([
        {
          entity_id: '283',
          entity_type: 'Tenant',
          id: expect.any(Number),
          occurred_on: new Date('2023-03-31 15:30'),
          payload: {},
          payload_version: 1,
          tenant_id: '283',
          type: 'rouletteTurnedOn',
        },
      ]);
    });
  });
});
