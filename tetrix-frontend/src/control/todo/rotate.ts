import { want } from '../../unit/';
import { down as eventDown, up as eventUp } from '../../unit/event';
import { rotate } from '@/actions/keyboard';
import { states } from '../states';
import { music } from '../../unit/music';
import { moveBlock } from '@/actions';

export const down = (store: any) => {
  store.dispatch(rotate(true));
  if (store.getState().get('cur') !== null) {
    eventDown({
      key: 'rotate',
      once: true,
      callback: () => {
        const state = store.getState();
        if (state.get('lock')) {
          return;
        }
        if (state.get('pause')) {
          states.pause(false);
        }
        const cur = state.get('cur');
        if (cur === null) {
          return;
        }
        if (music.rotate) {
          music.rotate();
        }
        const next = cur.rotate();
        if (want(next, state.get('matrix'))) {
          store.dispatch(moveBlock(next));
        }
      },
    });
  } else {
    eventDown({
      key: 'rotate',
      begin: 200,
      interval: 100,
      callback: () => {
        if (store.getState().get('lock')) {
          return;
        }
        if (music.move) {
          music.move();
        }
        const state = store.getState();
        const cur = state.get('cur');
        if (cur) {
          return;
        }
        let startLines = state.get('startLines');
        startLines = startLines + 1 > 10 ? 0 : startLines + 1;
        store.dispatch(startLines(startLines));
      },
    });
  }
};

export const up = (store: any) => {
  store.dispatch(rotate(false));
  eventUp({
    key: 'rotate',
    callback: () => {
      store.dispatch(rotate(false));
    },
  });
};