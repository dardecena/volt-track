import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import type { Server } from 'http';

describe('Robots (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /robots -> 200 and returns an array', async () => {
    const res = await request(httpServer).get('/robots');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /robots/:id/status -> 404 for well-formed but nonexistent id', async () => {
    const res = await request(httpServer).post('/robots/zzzzz/status').send({
      batteryLevel: 80,
      chargingState: 'idle',
      lastSeen: new Date().toISOString(),
      errorCode: null,
    });

    expect(res.status).toBe(404);
  });

  it('POST /robots/:id/status -> 400 for an invalid body', async () => {
    const res = await request(httpServer)
      .post('/robots/zzzzz/status')
      .send({ batteryLevel: 150 }); // out of range, missing required fields

    expect(res.status).toBe(400);
  });

  it('GET /robots/:id/status-history -> 404 for a non-existent robot', async () => {
    const res = await request(httpServer).get('/robots/zzzzz/status-history');

    expect(res.status).toBe(404);
  });
});
