const initModules = appContainer => {
  // clients
  appContainer.factory({
    accountsAPIClient: require('../clients/accounts-api-client').factory,
  });

  // managers
  appContainer.factory({
    accountsManager: require('../managers/accounts-manager').factory,
  });

  // services
  appContainer.factory({
    accountsService: require('../services/accounts-service').factory,
    cloudEventsService: require('../services/cloud-events-service').factory,
  });

  // routes
  appContainer.factory({
    routes: [
      require('../router/events-router').factory,
    ]
  });
};

module.exports = {
  initModules,
};
