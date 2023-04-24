import { OperatorReleaseCommand } from '@/core/app-service/operator-release/operator-release.command';
import { OperatorReleaseHandler } from '@/core/app-service/operator-release/operator-release.handler';
import { IDomainEvent } from '@/core/domain/event/domain.event';
import { LoggerFabric } from '@/infrastructure/logger/logger.fabric';
import { ServiceMessenger } from '@/infrastructure/outgoing/http/service.messenger';
import { HandlerEiBase } from './handler.ei.base';

export class HandlerEiOperatorCallAssigned extends HandlerEiBase<'Operator', 'callAssigned'> {
  constructor(
    loggerFabric: LoggerFabric,
    private readonly serviceMessenger: ServiceMessenger,
    private readonly operatorReleaseHandler: OperatorReleaseHandler,
  ) {
    super(loggerFabric);
  }

  public get entityType(): 'Operator' {
    return 'Operator';
  }
  public get eventType(): 'callAssigned' {
    return 'callAssigned';
  }
  protected async doHandle(event: IDomainEvent<'Operator', 'callAssigned'>): Promise<void> {
    try {
      await this.serviceMessenger.operatorAssignCall(event.tenantId, event.entityId, event.payload.callId);
    } catch (error) {
      if (error.status === 412) {
        this.logger.warn(
          `Unable Call assigning. Tenant ${event.tenantId} ; operator ${event.entityId}; call ${event.payload.callId}; status ${error.status}`,
        );
        const command = new OperatorReleaseCommand(
          event.tenantId,
          event.occurredOn,
          event.entityId,
          event.payload.callId,
        );
        return this.operatorReleaseHandler.handle(command);
      }
      throw error;
    }
  }
}
