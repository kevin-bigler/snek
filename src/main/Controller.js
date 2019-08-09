import * as R from 'ramda';

type KeyPress = {
    pressed: boolean,
    duration: number
};

type Key = {
    code: string,
    subs: [Function]
}

type KeyName =
    'UP' |
    'DOWN' |
    'LEFT' |
    'RIGHT' |
    'A' |
    'B'|
    'START'|
    'SELECT';

const allKeys = [
    'UP',
    'DOWN',
    'LEFT',
    'RIGHT',
    'A',
    'B',
    'START',
    'SELECT'];

// TODO: codes for each key need to load from config, so we can try different setups

export default class Controller {
    /**
     *
     * @param {[KeyName]} [keys] Key names. Defaults to all keys
     * @param {boolean} [enableCursor]
     */
    constructor({keys = allKeys, enableCursor = true}) {
        this.keys = keys;
        this.enableCursor = enableCursor;
        // init keySubs so each key has a corresponding empty array
        this.keySubs = {};
        keys.forEach(k => this.keySubs[k] = []);
    }

    /**
     *
     * @param {Function} listener
     * @param {[KeyName]|KeyName} key
     */
    addListener(listener, key) {
        // turn key into an array, unique
        // for each k, add listener to keysubs (which may or may not have an array yet)
        R.uniq(Array.isArray(key) ? key : [key])
            .forEach(k => this.keySubs[k].push(listener));
    }

    removeListener(listener, key) {
        // TODO
    }
}