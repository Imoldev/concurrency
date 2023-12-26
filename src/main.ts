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
    '/insert',
    asyncHandler(async (request, response) => {
      console.log(98789789);
      response.status(200);
    }),
  );

  expressServer.listen(serverPort, () => {
    console.info(`Server started at port: ${serverPort}`);
  });
}
bootstrap();
