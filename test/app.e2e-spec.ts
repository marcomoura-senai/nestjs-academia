import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { InstrutorLoginController } from '../src/instrutor/instrutor-login.controller';

describe(`${InstrutorLoginController.name} (e2e)`, () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    // localhost:3000/instrutores/login
    const result = await request(app.getHttpServer()).post(
      '/instrutores/login',
    );

    expect(result.status).toBe(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
