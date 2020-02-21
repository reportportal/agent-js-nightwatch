const publishEvent = (event, msg) => process.emit(event, msg);

const subscribeToEvent = (event, callback) => process.on(event, callback);

module.exports = {
  publishEvent,
  subscribeToEvent,
};
