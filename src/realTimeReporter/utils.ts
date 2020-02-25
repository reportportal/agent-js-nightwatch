const publishEvent = (event, msg) => process.emit(event, msg);

const subscribeToEvent = (event, callback) => process.on(event, callback);

export {
  publishEvent,
  subscribeToEvent,
}
