import { Entities } from '@/core/domain/entities';
import { EventMap, IDomainEventBase } from '@/core/domain/event/domain.event';
import { HandlerEiBase } from './handler.ei.base';

export class EventBus {
  private readonly handlersMap = new Map();

  private logger;

  constructor() {
    this.direct.bind(this);
    this.logger = console;
  }

  public direct = async <T extends IDomainEventBase>(event: T) => {
    if (!this.handlersMap.has(event.entityType)) {
      this.logger.warn(`Handler not found for entity ${event.entityType}`);
      return;
    }

    const handler = this.handlersMap.get(event.entityType).get(event.type);
    if (handler === undefined) {
      this.logger.warn(`Handler not found for entity ${event.entityType} and type ${String(event.type)}`);
      return;
    }

    return handler.handle(event);
  };

  public addHandler = <Entity extends keyof typeof Entities, Event extends keyof EventMap[Entity]>(
    handler: HandlerEiBase<Entity, Event>,
  ) => {
    if (!this.handlersMap.has(handler.entityType)) {
      this.handlersMap.set(handler.entityType, new Map());
    }
    this.handlersMap.get(handler.entityType).set(handler.eventType, handler);
  };
}
