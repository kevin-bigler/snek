'use strict';

import Game from './main/state/Game';
import {getState} from './main/state/states';
import bb from './main/bb';
import GameLoop from './main/GameLoop';

const main = () => {
    console.log('main start');
    bb.currentState = 'Game';
    bb.fps = 60.0; // TODO make this value configurable
    const gameLoop = new GameLoop(bb.fps, getUpdateFn, frameRateListener);
    gameLoop.start();
};

const getUpdateFn = () => {
    const state = getState(bb.currentState);
    state.update();
};

/**
 * Listener that's called each time frame rate is calculated
 * @param frameRate
 */
const frameRateListener = (frameRate) => {
    document.getElementById('fps').innerHTML = 'fps: ' + Math.round(frameRate);
};

main();