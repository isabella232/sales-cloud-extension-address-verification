const express = require('express');
const { eventControllers } = require('../controllers');
const { server: { eventsBaseURL } } = require('../constants/constants');
const registerRoutes = require('./router-handler');

module.exports = {
    factory: appContainer => {
        return registerRoutes(appContainer, eventsBaseURL, express.Router(), eventControllers);
    }
};
