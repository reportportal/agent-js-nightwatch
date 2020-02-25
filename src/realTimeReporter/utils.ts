import { EVENTS } from '../constants';

export const publishEvent = (event: EVENTS, msg: any): void => {
  // @ts-ignore
  process.emit(event, msg);
};

export const subscribeToEvent = (event: EVENTS, callback: (params: any) => void): void => {
  // @ts-ignore
  process.on(event, callback);
};
