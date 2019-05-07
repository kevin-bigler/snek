import type {GameState} from './GameState.type';

export default class MainMenu implements GameState {
    constructor() {
        console.log('MainMenu init');
    }

    update(dt: number) {
        console.log('MainMenu.update()');
    }
}