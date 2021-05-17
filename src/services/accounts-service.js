const { BaseService } = require("./base-service")
const logger = require('../logger/console')("AccountsCacheService");

class AccountsService extends BaseService {
  constructor(accountsManager) {
    super("Account", {
      Any: () => this._any,
    })

    this.accountsManager = accountsManager;
  }

  _any = (entityId, eventType) => {
    return this.accountsManager.updateAccount(entityId);
  }

  _root = (entityId, eventType) => {
    if (eventType === 'Created') {

    } if (eventType === 'Updated') {

    } if (eventType === 'Deleted') {

    }
    return Promise.reject(`invalid event type for accounts received: ${eventType}`);
  }

}
module.exports = {
  factory(accountsManager) {
    return new AccountsService(accountsManager);
  },
};
