import { config } from './bootstrap/config';
import * as express from "express";
import * as asyncHandler from 'express-async-handler';
import { asyncStorageDb } from '@/bootstrap/async-storage-db';
import { PromiseTransactionHandler } from './core/app-service/promise-transaction.handler';

const serverPort = config.server.serverPort;
const nodeEnv = config.nodeEnv;

async function bootstrap() {
  const expressServer = express();

  

  const handler = new PromiseTransactionHandler(asyncStorageDb)

  expressServer.post(
    '/insert',
    asyncHandler(async (request, response) => {
      await handler.handle();
      response.status(201).send('Ok');
    }),
  );

  expressServer.listen(serverPort, () => {
    console.info(`Server started at port: ${serverPort}`);
  });
}
bootstrap();
