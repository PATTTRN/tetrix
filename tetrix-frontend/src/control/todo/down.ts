import { want } from '../../unit/';
import { states } from '../states';
import { music } from '../../unit/music';
import { keyDown as keyboardDown, moveBlock, startLines } from '../../actions';
import { down as eventDown, up as eventUp } from '../../unit/event';
export const down = (store: any) => {
  store.dispatch(keyboardDown(true));
  if (store.getState().get('cur') !== null) {
    eventDown({
      key: 'down',
      begin: 40,
      interval: 40,
      callback: (stopDownTrigger: any) => {
        const state = store.getState();
        if (state.get('lock')) {
          return;
        }
        if (music.move) {
          music.move();
        }
        const cur = state.get('cur');
        if (cur === null) {
          return;
        }
        if (state.get('pause')) {
          states.pause(false);
          return;
        }
        const next = cur.fall();
        if (want(next, state.get('matrix'))) {
          store.dispatch(moveBlock(next));
          states.auto(0);
        } else {
          let matrix = state.get('matrix');
          const shape = cur.shape;
          const xy = cur.xy;
          shape.forEach((m: any, k1: any) => (
            m.forEach((n: any, k2: any) => {
              if (n && xy.get(0) + k1 >= 0) { // 竖坐标可以为负
                let line = matrix.get(xy.get(0) + k1);
                line = line.set(xy.get(1) + k2, 1);
                matrix = matrix.set(xy.get(0) + k1, line);
              }
            })
          ));
          states.nextAround(matrix, stopDownTrigger);
        }
      },
    });
  } else {
    eventDown({
      key: 'down',
      begin: 200,
      interval: 100,
      callback: () => {
        if (store.getState().get('lock')) {
          return;
        }
        const state = store.getState();
        const cur = state.get('cur');
        if (cur) {
          return;
        }
        if (music.move) {
          music.move();
        }
        let startLines = state.get('startLines');
        startLines = startLines - 1 < 0 ? 10 : startLines - 1;
        store.dispatch(startLines(startLines));
      },
    });
  }
};

export const up = (store: any) => {
  store.dispatch(keyboardDown(false));
  eventUp({
    key: 'down',
    callback: () => {
      store.dispatch(keyboardDown(false));
    },
  });
};
