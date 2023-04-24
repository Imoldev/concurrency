import { LoggerService } from '@nestjs/common';
import * as Pino from 'pino';

export class Logger implements LoggerService {
  private logger: any;

  constructor(logger: Pino.Logger) {
    this.logger = logger;
  }

  public debug(message: any, ...optionalParams: any[]): any {
    this.logger.debug(message, optionalParams);
  }

  public error(message: any, ...optionalParams: any[]): any {
    this.logger.error(message, optionalParams);
  }

  public log(message: any, ...optionalParams: any[]): any {
    this.logger.info(message, optionalParams);
  }

  public warn(message: any, ...optionalParams: any[]): any {
    this.logger.warn(message, optionalParams);
  }
}
