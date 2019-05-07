import type {GameState} from './GameState.type';

export default class PauseMenu implements GameState {
    constructor() {
        console.log('PauseMenu init');
    }

    update(dt: number) {
        console.log('PauseMenu.update()');
    }
}