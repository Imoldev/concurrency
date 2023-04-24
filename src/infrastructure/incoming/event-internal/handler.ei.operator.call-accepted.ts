import { OperatorReleaseCommand } from '@/core/app-service/operator-release/operator-release.command';
import { OperatorReleaseHandler } from '@/core/app-service/operator-release/operator-release.handler';
import { IDomainEvent } from '@/core/domain/event/domain.event';
import { LoggerFabric } from '@/infrastructure/logger/logger.fabric';
import { ServiceMessenger } from '@/infrastructure/outgoing/http/service.messenger';
import { HandlerEiBase } from './handler.ei.base';

export class HandlerEiOperatorCallAccepted extends HandlerEiBase<'Operator', 'callAccepted'> {
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
  public get eventType(): 'callAccepted' {
    return 'callAccepted';
  }

  protected async doHandle(event: IDomainEvent<'Operator', 'callAccepted'>): Promise<void> {
    try {
      await this.serviceMessenger.operatorAcceptCall(event.tenantId, event.entityId, event.payload.callId);
    } catch (error) {
      if (error.status === 404 || error.status === 412) {
        this.logger.warn(
          `Unable Call accepting. Tenant ${event.tenantId} ; operator ${event.entityId}; call ${event.payload.callId}; status ${error.status}`,
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
