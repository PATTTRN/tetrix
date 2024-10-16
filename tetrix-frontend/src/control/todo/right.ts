import { want } from '../../unit/';
import { music } from '../../unit/music';
import { down as eventDown, up as eventUp } from '../../unit/event';
import { right } from '@/actions/keyboard';
import { delays } from '@/unit/const';
import { speed as speeds } from '@/unit/const';
import { states } from '../states';
import { moveBlock, speedStart } from '@/actions';

export const down = (store: any) => {
  store.dispatch(right(true));
  eventDown({
    key: 'right',
    begin: 200,
    interval: 100,
    callback: () => {
      const state = store.getState();
      if (state.get('lock')) {
        return;
      }
      if (music.move) {
        music.move();
      }
      const cur = state.get('cur');
      if (cur !== null) {
        if (state.get('pause')) {
          states.pause(false);
          return;
        }
        const next = cur.right();
        const delay = delays[state.get('speedRun') - 1];
        let timeStamp;
        if (want(next, state.get('matrix'))) {
          next.timeStamp += delay;
          store.dispatch(moveBlock(next));
          timeStamp = next.timeStamp;
        } else {
          cur.timeStamp += delay / 1.5; // 真实移动delay多一点，碰壁delay少一点
          store.dispatch(moveBlock(cur));
          timeStamp = cur.timeStamp;
        }
        const remain = speeds[state.get('speedRun') - 1] - (Date.now() - timeStamp);
        states.auto(remain);
      } else {
        let speed = state.get('speedStart');
        speed = speed + 1 > 6 ? 1 : speed + 1;
        store.dispatch(speedStart(speed));
      }
    },
  });
};

export const up = (store: any) => {
  store.dispatch(right(false));
  eventUp({
    key: 'right',
    callback: () => {
      store.dispatch(right(false));
    },
  });
};