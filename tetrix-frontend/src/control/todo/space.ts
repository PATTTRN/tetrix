import { want } from '../../unit/';
import { drop, moveBlock } from '../../actions';
import { states } from '../states';
import { music } from '../../unit/music';
import { down as eventDown, up as eventUp } from '../../unit/event';
export const down = (store: any) => {
  store.dispatch(drop(true));
  eventDown({
    key: 'space',
    once: true,
    callback: () => {
      const state = store.getState();
      if (state.get('lock')) {
        return;
      }
      const cur = state.get('cur');
      if (cur !== null) { // 置底
        if (state.get('pause')) {
          states.pause(false);
          return;
        }
        if (music.fall) {
          music.fall();
        }
        let index = 0;
        let bottom = cur.fall(index);
        while (want(bottom, state.get('matrix'))) {
          bottom = cur.fall(index);
          index++;
        }
        let matrix = state.get('matrix');
        bottom = cur.fall(index - 2);
        store.dispatch(moveBlock(bottom));
        const shape = bottom.shape;
        const xy = bottom.xy;
        shape.forEach((m: any, k1: any) => (
          m.forEach((n: any, k2: any) => {
            if (n && xy[0] + k1 >= 0) { // 竖坐标可以为负
              let line = matrix.get(xy[0] + k1);
              line = line.set(xy[1] + k2, 1);
              matrix = matrix.set(xy[0] + k1, line);
            }
          })
        ));
        store.dispatch(drop(false));
        setTimeout(() => {
          store.dispatch(drop(false));
        }, 100);
        states.nextAround(matrix);
      } else {
        states.start();
      }
    },
  });
};

export const up = (store: any) => {
  store.dispatch(drop(false));
  eventUp({
    key: 'space',
    callback: () => {
      store.dispatch(drop(false));
    },
  });
};
