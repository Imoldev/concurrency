import { OperatorReleaseCommand } from '@/core/app-service/operator-release/operator-release.command';
import { OperatorReleaseHandler } from '@/core/app-service/operator-release/operator-release.handler';
import { IDomainEvent } from '@/core/domain/event/domain.event';
import { LoggerFabric } from '@/infrastructure/logger/logger.fabric';
import { ServiceMessenger } from '@/infrastructure/outgoing/http/service.messenger';
import { HandlerEiBase } from './handler.ei.base';

export class HandlerEiOperatorTransferAccepted extends HandlerEiBase<'Operator', 'transferAccepted'> {
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
  public get eventType(): 'transferAccepted' {
    return 'transferAccepted';
  }

  protected async doHandle(event: IDomainEvent<'Operator', 'transferAccepted'>): Promise<void> {
    try {
      await this.serviceMessenger.operatorAcceptTransfer(
        event.tenantId,
        event.entityId,
        event.payload.consultationId,
        event.payload.transferId,
      );
    } catch (error) {
      if (error.status === 404 || error.status === 412) {
        this.logger.warn(
          `Unable Call accepting. Tenant ${event.tenantId} ; operator ${event.entityId}; consultation ${event.payload.consultationId}; transfer ${event.payload.transferId}; status ${error.status}`,
        );
        const command = new OperatorReleaseCommand(
          event.tenantId,
          event.occurredOn,
          event.entityId,
          event.payload.transferId,
        );
        return this.operatorReleaseHandler.handle(command);
      }
      throw error;
    }
  }
}
