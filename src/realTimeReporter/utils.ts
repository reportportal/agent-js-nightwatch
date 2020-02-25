import { EVENTS } from '../constants';

const publishEvent = (event: EVENTS, msg: any): void => {
  // @ts-ignore
  process.emit(event, msg);
};

const subscribeToEvent = (event: EVENTS, callback: (params: any) => void): void => {
  // @ts-ignore
  process.on(event, callback);
};

export {
  publishEvent,
  subscribeToEvent,
}
