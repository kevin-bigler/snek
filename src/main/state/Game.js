import type {GameState} from './GameState.type';
import bb from '../bb';

export default class Game implements GameState {
    /**
     * Dependency Injection constructor
     *
     * @param {object} deps Dependencies
     * @param deps.bb BlackBoard, records game state (globally accessible)
     * @param deps.controller Helper to know what controls are active/inactive
     * @param deps.artist Helper to draw things to the UI
     */
    constructor({bb, controller, artist}) {
        // this.bb = bb;
        this.controller = controller;
        this.artist = artist;
        this.initialized = false;
        this.state = 'init';

        this.init();
    }

    init() {
        console.log('game init');
        setTimeout(() => bb.currentState = 'MainMenu', 3000);
        // TODO create snake, scoreboard, etc

        const snek = new Snek();
        const board = new Board({width: 30, height: 20});
        board.addEventListener('DIE', () => console.error('you died')); // TODO death function

        board.clear();
        board.setHead({x: 5, y: 5});
        board.move('UP');
        board.move('DOWN');
        board.move('LEFT');
        board.move('RIGHT');

        this.snek = snek;
        this.board = board;

        this.initialized = true;
        this.state = 'normal';
    }

    update(dt: number) {
        console.log('Game.update()');
        if (!this.initialized) {
            this.init();
        }
        this.readInput(dt);
        this.updateState(dt);
        this.draw();
    }

    readInput(dt) {

    }

    updateState(dt) {
        statedates[this.state](dt);
    }

    draw() {

    }
}

const statedates = {
    normal: (dt) => {

    }
};