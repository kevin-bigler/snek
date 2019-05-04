'use strict';

import Game from './main/state/Game';

/**
 * BlackBoard -- read and write various, globally accessible game information
 */
const bb = {
    // TODO: would this be better as a Map?
};

let currentState = 'Game';

const main = () => {
    // initialize Game
    // provide artist to Game (?)
    // provide bb to game
    // set current state to Game
    // start game loop (point to current state)
    const game = new Game();
    gameLoop(1.0 / 60.0, currentState);
};

let game, mainMenu, pauseMenu;
const states = {
    Game: () => {
        if (!game) {
            game = new Game();
        }
    },
    MainMenu: () => {

    },
    PauseMenu: () => {

    }
};

main();