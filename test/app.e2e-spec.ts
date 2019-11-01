import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('init client', () => {
    return request(app.getHttpServer()).post('/init').send({
      apiKey: 'server_c383bd95be5d224a891730c12e99ea55',
      network: 'mainnet',
    }).expect(201).expect({
      code: 0,
      msg: '',
      data: {
        success: true,
      },
    });
  });

  it('get history', () => {
    return request(app.getHttpServer()).get('/history/eoscanadacom?startBlock=100&blockCount=10&sort=asc').expect(200).expect((err, res) => {
      if (err != null) {
        throw err;
      }

      // console.log(res.data.transactions.length);
    });
  });
});
