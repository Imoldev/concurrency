import { DecisionMakeCommand } from '@/core/app-service/decision-make/decision-make.command';
import { DecisionMakeHandler } from '@/core/app-service/decision-make/decision-make.handler';
import { IDomainEvent } from '@/core/domain/event/domain.event';
import { LoggerFabric } from '@/infrastructure/logger/logger.fabric';
import { HandlerEiBase } from './handler.ei.base';

export class HandlerEiTenantRouletteTurnedOn extends HandlerEiBase<'Tenant', 'rouletteTurnedOn'> {
  public get entityType(): 'Tenant' {
    return 'Tenant';
  }
  public get eventType(): 'rouletteTurnedOn' {
    return 'rouletteTurnedOn';
  }

  constructor(loggerFabric: LoggerFabric, private readonly decisionMakeHandler: DecisionMakeHandler) {
    super(loggerFabric);
  }

  protected doHandle(event: IDomainEvent<'Tenant', 'rouletteTurnedOn'>): Promise<void> {
    const { tenantId, occurredOn } = event;
    const command = new DecisionMakeCommand(tenantId, occurredOn);
    return this.decisionMakeHandler.handle(command);
  }
}
