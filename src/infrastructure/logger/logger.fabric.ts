import { LogLevel } from '@/bootstrap/config';
import * as Pino from 'pino';
import { LoggerOptions } from 'pino';
import { Logger } from './logger';

export class LoggerFabric {
  private logger: Pino.Logger;

  constructor(logLevel: LogLevel, prettyMode: boolean) {
    let options: LoggerOptions = {
      level: logLevel,
      formatters: {
        level: (label) => {
          return { level: label.toLocaleUpperCase() };
        },
      },
      timestamp: Pino.stdTimeFunctions.isoTime,
    };

    if (prettyMode) {
      options = {
        ...options,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      };
    }
   
    this.logger = Pino.pino(options);
  }

  getLogger(name: string): Logger {
    const fork = this.logger.child({ module: name });
    return new Logger(fork);
  }
}
