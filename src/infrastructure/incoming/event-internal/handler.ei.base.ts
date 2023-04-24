import { Entities } from '@/core/domain/entities';
import { EventMap, IDomainEvent } from '@/core/domain/event/domain.event';
import { ErrorUnexpectedData } from '@/infrastructure/error/error.unexpected.data';
import { Logger } from '@/infrastructure/logger/logger';
import { LoggerFabric } from '@/infrastructure/logger/logger.fabric';

export abstract class HandlerEiBase<
  EntityType extends keyof typeof Entities,
  EventType extends keyof EventMap[EntityType],
> {
  public abstract get entityType(): EntityType;

  public abstract get eventType(): EventType;

  protected logger: Logger;

  constructor(loggerFabric: LoggerFabric) {
    this.handle = this.handle.bind(this);
    this.logger = loggerFabric.getLogger(this.constructor.name);
  }

  public handle<EntityT extends EntityType, EventT extends EventType>(event: IDomainEvent<EntityT, EventT>) {
    if (!this.isEventTarget(event)) {
      delete event['id'];
      throw new ErrorUnexpectedData(
        `Handler ${this.constructor.name} is not consist handled Event: ${JSON.stringify(event)}`,
      );
    }
    this.logger.debug('Handle internal event. Entity: ' + event.entityType + '; Event' + (event.type as String));
    return this.doHandle(event);
  }

  protected abstract doHandle(event: IDomainEvent<EntityType, EventType>): Promise<void>;

  private isEventTarget<EntityT extends EntityType, EventT extends EventType>(
    event: IDomainEvent<EntityT, EventT>,
  ): event is IDomainEvent<EntityT, EventT> {
    return event.entityType === this.entityType && event.type === this.eventType;
  }
}
