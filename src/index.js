'use strict';

import Game from './main/state/Game';
import {getState} from './main/state/states';
import bb from './main/bb';
import GameLoop from './main/GameLoop';
import onFrameRateUpdate from './main/onFrameRateUpdate';

const main = () => {
    console.log('main start');
    bb.currentState = 'Game';
    // TODO make fps configurable
    bb.fps = 60.0;
    const gameLoop = new GameLoop(bb.fps, getUpdateFn, onFrameRateUpdate);
    gameLoop.start();
};

const getUpdateFn = () => {
    const state = getState(bb.currentState);
    state.update();
};

main();