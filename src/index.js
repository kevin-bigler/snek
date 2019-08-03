'use strict';

import Game from './main/state/Game';
import {getState} from './main/state/states';
import bb from './main/bb';
import GameLoop from './main/GameLoop';
import writeFps from './main/writeFps';

const main = () => {
    console.log('main start');
    bb.currentState = 'Game';
    // TODO make fps configurable
    bb.fps = 60.0;
    const gameLoop = new GameLoop({fps: bb.fps, fn: getUpdateFn, onFpsUpdate: writeFps});
    gameLoop.start();
};

const getUpdateFn = () => {
    const state = getState(bb.currentState);
    state.update();
};

main();