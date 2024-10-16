import { down as eventDown, up as eventUp } from '../../unit/event';
import { states } from '../states';
import { pause } from '../../actions';

export const down = (store: any) => {
  store.dispatch(pause(true));
  eventDown({
    key: 'p',
    once: true,
    callback: () => {
      const state = store.getState();
      if (state.get('lock')) {
        return;
      }
      const cur = state.get('cur');
      const isPause = state.get('pause');
      if (cur !== null) { // 暂停
        states.pause(!isPause);
      } else { // 新的开始
        states.start();
      }
    },
  });
};

export const up = (store: any) => {
  store.dispatch(pause(false));
  eventUp({
    key: 'p',
    callback: () => {
      store.dispatch(pause(false));
    },
  });
};
