import type {Size, Position, Direction} from './types';

export default class Board {
    head: Position;
    tails: [Position] = [];
    size: Size;
    eventListeners: [Function] = [];
    lastDir;
    apples: [Position] = [];

    /**
     *
     * @param {Size} size
     */
    constructor(size: Size) {
        this.size = size;
    }

    clear() {
        console.log('---');
        this.head = null;
        this.tails = [];
        this.lastDir = null;
    }

    /**
     * Set snek head on the board somewhere
     * @param {Position} pos
     */
    setHead(pos) {
        console.log('SET HEAD:', pos);
        this.head = {...pos};
    }

    addApple(pos: Position) {
        this.apples.push({...pos});
    }

    move(direction: Direction) {
        console.log('MOVE: ', direction);

        const dir = checkDir(direction, this.lastDir);
        console.log('ACTUAL MOVE:', dir);

        const newPos = moves[dir](this.head);
        if (!this.inBounds(newPos)) {
            this.die(newPos, 'HIT_WALL');
            return;
        } else if (this.hitTail(newPos)) {
            this.die(newPos, 'ATE_TAIL');
            return;
        }

        this.tails.push({...this.head});
        if (this.hitApple(newPos)) {
            this.eat(newPos);
        } else {
            this.tails.shift(); // remove the oldest tail (first element)
        }
        this.head = newPos;
        this.lastDir = direction;
    }

    hitApple(pos: Position) {
        console.log('apple hit check');
        return this.apples.some(apple =>
            apple.x === pos.x
            && apple.y === pos.y);
    }

    inBounds(pos: Position): boolean {
        console.log('bounds check', {pos, size: this.size});
        return pos.x < this.size.width && pos.x >= 0
            && pos.y < this.size.height && pos.y >= 0;
    }

    hitTail(pos: Position): boolean {
        console.log('tail hit check');
        return this.tails.some(tail =>
            tail.x === pos.x
            && tail.y === pos.y);
    }

    addEventListener(type: string, fn: Function) {
        this.eventListeners.push({type, fn});
    }

    removeEventListener(fn: Function) {
        this.eventListeners = this.eventListeners.filter(x => x.fn !== fn);
    }

    notifyEventListeners(type, data) {
        console.log('notifyEventListeners, ', this.eventListeners);
        this.eventListeners.filter(x => x.type === type).forEach(x => x.fn({type, ...data}));
    }

    /**
     * Snek die ;(
     *
     * @param pos The attempted new position
     * @param cause The cause of death
     */
    die(pos: Position, cause: DeathCause) {
        this.notifyEventListeners('DIE', {tailLength: this.tails.length, attemptedPos: pos, cause});
    }

    eat(pos: Position) {
        // remove the apple
        this.apples = this.apples.filter(apple => apple.x !== pos.x && apple.y !== pos.y);
        // notify
        this.notifyEventListeners('EAT', {tailLength: this.tails.length, pos});
    }
}

const moves = {
    UP: ({x, y}) => ({x, y: --y}),
    DOWN: ({x, y}) => ({x, y: ++y}),
    LEFT: ({x, y}) => ({x: --x, y}),
    RIGHT: ({x, y}) => ({x: ++x, y})
};

// opposite directions

const opposites = [
    ['LEFT', 'RIGHT'],
    ['UP', 'DOWN']
];
const isOpposite = (d1: Direction, d2: Direction) =>
    opposites.some(([a, b]) =>
        d1 === a && d2 === b ||
        d1 === b && d2 === a);
const getOpposite = (d1: Direction) =>
    opposites
    .filter(([a, b]) =>
        d1 === a || d1 === b)
    .filter(d =>
        d !== d1);
/**
 * Can't move backwards
 *
 * @param dir
 * @param lastDir
 */
const checkDir = (dir: Direction, lastDir: Direction) =>
    lastDir && isOpposite(dir, lastDir)
        ? lastDir
        : dir;

type DeathCause = 'HIT_WALL' | 'ATE_TAIL';