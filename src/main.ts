import { config } from './bootstrap/config';
import * as express from "express";
import * as asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { goalsHandler } from './bootstrap/app';

const serverPort = config.server.serverPort;
const nodeEnv = config.nodeEnv;

async function bootstrap() {
  const expressServer = express();

  expressServer.post(
    '/red',
    asyncHandler(async (request, response) => {
      await goalsHandler.score(uuidv4(), 'red');
      response.status(201).send('Ok');
    }),
  );

  expressServer.post(
    '/green',
    asyncHandler(async (request, response) => {
      await goalsHandler.score(uuidv4(), 'green');
      response.status(201).send('Ok');
    }),
  );

  expressServer.listen(serverPort, () => {
    console.info(`Server started at port: ${serverPort}`);
  });
}
bootstrap();
