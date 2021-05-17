const { eventErrors: { EVENT_HANDLER_NOT_IMPLEMENTED, EVENT_TYPE_UNDEFINED } } = require('../constants/errors');
const logger = require('../logger/console')("CloudEventsService");

class CloudEventsService {
  constructor(accountsService) {
    this.accountsService = accountsService;
  }

  handleSalesCloudEvent(eventData) {
    return this._updateCacheOnEvent(eventData);
  }

  _updateCacheOnEvent(event) {
    logger.info(`Updating event: ${event}`);
    // if (!event.type) {
    //   return Promise.reject(EVENT_TYPE_UNDEFINED);
    // }
    //
    // const [group, elem, type] = event.type.split(".")
    // const eventHandler = this.eventHandlers[group];
    // if (!eventHandler) {
    //   logger.error(`No handler found for subscribed event: ${event.type}`);
    //   return Promise.reject(EVENT_HANDLER_NOT_IMPLEMENTED);
    // }
    return this.accountsService.updateCacheByEventType({
      entityId: event.data["entity-id"],
      // eventElement: elem,
      // eventType: type,
    });
  }
}
module.exports = {
  factory(accountsService) {
    return new CloudEventsService(accountsService);
  },
};
