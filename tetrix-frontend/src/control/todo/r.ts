import { down as eventDown, up as eventUp } from '../../unit/event';
import { states } from '../states';
import { reset } from '../../actions';

export const down = (store: any) => {
  store.dispatch(reset(true));
  if (store.getState().get('lock')) {
    return;
  }
  if (store.getState().get('cur') !== null) {
    eventDown({
      key: 'r',
      once: true,
      callback: () => {
        states.overStart();
      },
    });
  } else {
    eventDown({
      key: 'r',
      once: true,
      callback: () => {
        if (store.getState().get('lock')) {
          return;
        }
        states.start();
      },
    });
  }
};

export const up = (store: any) => {
  store.dispatch(reset(false));
  eventUp({
    key: 'r',
    callback: () => {
      store.dispatch(reset(false));
    },
  });
};