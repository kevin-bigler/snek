'use strict';

import Game from './main/state/Game';
import {getState} from './main/state/states';
import bb from './main/bb';
import GameLoop from './main/GameLoop';

const main = () => {
    console.log('main start');
    bb.currentState = 'Game';
    bb.fps = 25.0; // TODO make this value configurable
    const gameLoop = new GameLoop(bb.fps, () => getState(bb.currentState).update);
    gameLoop.start();
};



main();