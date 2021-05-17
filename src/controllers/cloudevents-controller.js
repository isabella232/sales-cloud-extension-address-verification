const { NO_CONTENT } = require('http-status-codes');
const { CloudEvent, HTTP } = require("cloudevents");
const logger = require('../logger/console')("CloudEventsController");

const CloudEventsControllerFactory = (cloudEventsService) => (req, res) => {
  const event = HTTP.toEvent({ headers: req.headers, body: req.body })
  return cloudEventsService
    .handleSalesCloudEvent(event)
    .then(() => {
      logger.info("Event successfully process:", event)
      res.status(200).json(event)
    })
    .catch(err => {
      logger.error("Event failed to be processed:", err)
      event.error = err
      res.status(415).json(event)
    });
};

module.exports = [{
  method: 'POST',
  path: '',
  name: 'CloudEventsControllerFactory',
  factory: CloudEventsControllerFactory,
}];
