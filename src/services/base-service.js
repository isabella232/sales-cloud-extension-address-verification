const logger = require('../logger/console')("BaseCacheService");

class BaseService {
  constructor(name, elementHandlers) {
    this.name = name
    this.elementHandlers = elementHandlers
  }

  updateCacheByEventType({ entityId, eventElement, eventType }) {
    logger.info(`Sales Cloud ${this.name}.${eventElement}.${eventType} event received`);
    const handler = this.__peekHandler(eventElement)
    if (!handler) {
      return new Promise(((resolve) => {
        logger.error(`Service ${this.name} has no handler for type: ${eventElement}`);
        resolve(false);
      }));
    }
    return handler()(entityId, eventType);
  }

  __peekHandler(eventElement) {
    const handler = this.elementHandlers[eventElement]
    if (!handler) {
      return this.elementHandlers["Any"]
    } else {
      return handler
    }
  }
}

module.exports = { BaseService }
