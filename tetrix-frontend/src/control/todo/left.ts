import { want } from '../../unit/';
import { down as eventDown, up as eventUp } from '../../unit/event';
import { keyDown as keyboardDown, moveBlock, speedStart, startLines } from '../../actions';
import { states } from '../states';
import { speed as speeds, delays } from '../../unit/const';
import { music } from '../../unit/music';

export const down = (store: any) => {
  store.dispatch(keyboardDown(true));
  eventDown({
    key: 'left',
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
        const next = cur.left();
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
        speed = speed - 1 < 1 ? 6 : speed - 1;
        store.dispatch(speedStart(speed));
      }
    },
  });
};

export const up = (store: any) => {
  store.dispatch(keyboardDown(false));
  eventUp({
    key: 'left',
    callback: () => {
      store.dispatch(keyboardDown(false));
    },
  });
};
