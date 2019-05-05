'use strict';

import Game from './main/state/Game';
import {getState} from './main/state/states';
import bb from './main/bb';

const main = () => {
    bb.currentState = 'Game';
    bb.fps = 1.0 / 60.0; // TODO make this value configurable
    const gameLoop = new GameLoop(1.0 / 60.0, () => getState(bb.currentState).update);
};



main();