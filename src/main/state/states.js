import Game from './Game';
import MainMenu from './MainMenu';
import PauseMenu from './PauseMenu';

// maybe should do a map with these instances and DRY the code, but only if we add many more
let game, mainMenu, pauseMenu;

/**
 * Provides singleton instances of the game states.
 *
 * Lazy-loads, ie only instantiates a state upon first use.
 *
 * @type {{Game: states.Game, PauseMenu: states.PauseMenu, MainMenu: states.MainMenu}}
 */
const states = {
    get Game() {
        if (!game) {
            console.log('instantiating Game');
            game = new Game({});
            game.update = game.update.bind(game);
        }
        return game;
    },
    get MainMenu() {
        if (!mainMenu) {
            console.log('instantiating MainMenu');
            mainMenu = new MainMenu();
            mainMenu.update = mainMenu.update.bind(mainMenu);
        }
        return mainMenu;
    },
    get PauseMenu() {
        if (!pauseMenu) {
            console.log('instantiating PauseMenu');
            pauseMenu = new PauseMenu();
            pauseMenu.update = pauseMenu.update.bind(pauseMenu);
        }
        return pauseMenu;
    }
};

export const getState = (name) => states[name];
