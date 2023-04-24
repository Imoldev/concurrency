import { NestFactory } from '@nestjs/core';
import { Argument, Command } from 'commander';

import { ModuleEventsPull } from './bootstrap/di/module.events-pull';
import { fetchPositiveNonZeroInt, parsePositiveNonZeroInt } from './bootstrap/utils';
import { Cyclic } from './infrastructure/incoming/cyclic';

const PID = process.pid;
const metricsPort = fetchPositiveNonZeroInt('PULLING_METRICS_SERVER_PORT');

process.on('SIGINT', (signal) => {
  console.warn(`Received ${signal} - ${PID} exited`);
  process.exit();
});

async function bootstrap() {
  const app = await NestFactory.create(ModuleEventsPull);
  app.enableCors();
  await app.listen(metricsPort);
  console.log(`Listen at port: ${metricsPort}`);

  const pullCommand = new Command('run-pulling');
  pullCommand.addArgument(new Argument('<delay>', 'loop delay, milliseconds'));
  pullCommand.action((delay) => {
    const cyclic = app.get(Cyclic);

    let resultDelay: number;
    if (delay === undefined) {
      resultDelay = 0;
    } else {
      resultDelay = parsePositiveNonZeroInt(delay);
    }
    cyclic.run(resultDelay);
  });

  pullCommand.parse(process.argv);

  console.info(`Process started with PID: ${PID} `);
}

bootstrap();
