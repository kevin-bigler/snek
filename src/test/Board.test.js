import Board from '../main/Board';
import clone from 'clone';

describe('Board', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board({width: 3, height: 3});
    });

    afterEach(jest.clearAllMocks);

    it('#setHead and #clear  happy path', () => {
        board.setHead({x: 2, y: 1});
    });

    // happy paths
    describe('#move changes position when there is space and nothing in the way', () => {
        beforeEach(() => {
            board.setHead({x: 1, y: 1});
        });

        const testScenarios = [
            { dir: 'LEFT', pos: {x: 0, y: 1} },
            { dir: 'RIGHT', pos: {x: 2, y: 1} },
            { dir: 'UP', pos: {x: 1, y: 0} },
            { dir: 'DOWN', pos: {x: 1, y: 2} }
        ];

        testScenarios.forEach(test =>
            it(test.dir, () => {
                board.move(test.dir);
                expect(board.head).toEqual(test.pos);
            })
        );
    });

    it('#move updates tail state data (add neck, remove tip of tail)', () => {
        board.addApple({x: 0, y: 1});
        board.addApple({x: 0, y: 2});
        board.setHead({x: 0, y: 0});
        board.move('DOWN');
        board.move('DOWN');
        // snek now has eaten 2 apples, so tail length is 2 while head is at (0, 2)

        expect(board.tails).toEqual([{x: 0, y: 0}, {x: 0, y: 1}]);
        expect(board.head).toEqual({x: 0, y: 2});

        board.move('RIGHT');
        expect(board.head).toEqual({x: 1, y: 2});
        expect(board.tails).toEqual({x: 0, y: 1}, {x: 0, y: 2});

        board.move('RIGHT');
        expect(board.head).toEqual({x: 2, y: 2});
        expect(board.tails).toEqual({x: 0, y: 2}, {x: 1, y: 2});

        board.move('UP');
        expect(board.head).toEqual({x: 2, y: 1});
        expect(board.tails).toEqual({x: 1, y: 2}, {x: 2, y: 2});

        board.move('UP');
        expect(board.head).toEqual({x: 2, y: 0});
        expect(board.tails).toEqual({x: 2, y: 2}, {x: 2, y: 1});

        board.move('LEFT');
        expect(board.head).toEqual({x: 1, y: 0});
        expect(board.tails).toEqual({x: 2, y: 1}, {x: 2, y: 0});

        board.move('LEFT');
        expect(board.head).toEqual({x: 0, y: 0});
        expect(board.tails).toEqual({x: 2, y: 0}, {x: 1, y: 0});

        board.move('DOWN');
        expect(board.head).toEqual({x: 0, y: 1});
        expect(board.tails).toEqual({x: 1, y: 0}, {x: 0, y: 0});

        board.move('DOWN');
        expect(board.head).toEqual({x: 0, y: 2});
        expect(board.tails).toEqual({x: 0, y: 0}, {x: 0, y: 1});
    });

    // hit walls/out of bounds
    describe('#move dies when going out of bounds (hit walls)', () => {
        const deathListener = jest.fn();

        beforeEach(() => {
            board.addEventListener('DIE', deathListener);
        });

        afterEach(() => {
            board.removeEventListener(deathListener);
        });

        afterEach(jest.clearAllMocks);

        const testScenarios = [
            { dir: 'UP', pos: {x: 0, y: 0} },
            { dir: 'UP', pos: {x: 1, y: 0} },
            { dir: 'UP', pos: {x: 2, y: 0} },
            { dir: 'DOWN', pos: {x: 0, y: 2} },
            { dir: 'DOWN', pos: {x: 1, y: 2} },
            { dir: 'DOWN', pos: {x: 2, y: 2} },
            { dir: 'LEFT', pos: {x: 0, y: 0} },
            { dir: 'LEFT', pos: {x: 0, y: 1} },
            { dir: 'LEFT', pos: {x: 0, y: 2} },
            { dir: 'RIGHT', pos: {x: 2, y: 0} },
            { dir: 'RIGHT', pos: {x: 2, y: 1} },
            { dir: 'RIGHT', pos: {x: 2, y: 2} }
        ];

        testScenarios.forEach(test =>
            it(`${test.dir} from ${test.pos}`, () => {
                board.setHead(test.pos);
                board.move(test.dir);
                // should die TODO
                expect(deathListener).toHaveBeenCalledTimes(1);
                expect(deathListener).toHaveBeenCalledWith(expect.objectContaining({type: 'DIE', cause: 'HIT_WALL'}));
            })
        );
    });

    // eats tail
    it('#move dies when eats tail', () => {
        const deathListener = jest.fn();
        board.addEventListener('DIE', deathListener);

        board.addApple({x: 0, y: 1});
        board.addApple({x: 0, y: 2});
        board.addApple({x: 1, y: 2});
        board.addApple({x: 2, y: 2});

        board.setHead({x: 0, y: 0});

        console.log(board.toString());
        board.move('DOWN');
        console.log(board.toString());
        board.move('DOWN');
        console.log(board.toString());
        board.move('RIGHT');
        console.log(board.toString());
        board.move('RIGHT');
        console.log(board.toString());
        // snek is now 5 long (4 tail, 1 head) - min. length to eat its tail. looks like this:
        /*
            x _ _
            x _ _
            x x o
         */
        board.move('UP');
        board.move('LEFT');
        // not dead yet
        expect(deathListener).toHaveBeenCalledTimes(0);
        console.log('not dead yet:');
        console.log(board.toString());

        // should die by doing this last move...
        board.move('DOWN');
        console.log('should be dead:');
        console.log(board.toString());
        expect(deathListener).toHaveBeenCalledTimes(1);
        expect(deathListener).toHaveBeenCalledWith(expect.objectContaining({type: 'DIE', cause: 'ATE_TAIL'}));
    });

    describe('#move continues straight if attempting opposite direction suddenly', () => {
        const testScenarios = [
            {
                from: {x: 0, y: 1},
                dirs: ['RIGHT', 'LEFT']
            },
            {
                from: {x: 2, y: 1},
                dirs: ['LEFT', 'RIGHT']
            },
            {
                from: {x: 1, y: 2},
                dirs: ['UP', 'DOWN']
            },
            {
                from: {x: 1, y: 0},
                dirs: ['DOWN', 'UP']
            }
        ];

        testScenarios.forEach(test =>
            it(`from ${test.dirs.join(' to ')}`, () => {
                board.setHead(test.from);
                board.move(test.dirs[0]);
                const copy = clone(board);
                board.move(test.dirs[1]); // attempts to move opposite direction
                copy.move(test.dirs[0]); // moves same direction
                // both end up in the same spot
                expect(board.head).toEqual(copy.head);
            })
        );
    });

    describe('#move to open space does not change length', () => {
        beforeEach(() => {
            board.setHead({x: 1, y: 1});
        });

        const dirs = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        dirs.forEach(dir =>
            it(dir, () => {
                expect(board.tails.length).toBe(0);
                board.move(dir);
                expect(board.tails.length).toBe(0);
            })
        );
    });

    it('#move eats apple, gets longer', () => {
        const eatListener = jest.fn();
        board.addEventListener('EAT', eatListener);

        expect(board.tails.length).toBe(0);
        expect(board.apples.length).toBe(0);
        board.addApple({x: 0, y: 0});
        expect(board.apples.length).toBe(1);
        expect(board.tails.length).toBe(0);
        board.setHead({x: 1, y: 1});
        board.move('UP');

        expect(board.tails.length).toBe(0);
        board.move('LEFT');
        expect(board.tails.length).toBe(1);
        expect(board.apples.length).toBe(0);

        expect(eatListener).toHaveBeenCalledTimes(1);
        expect(eatListener).toHaveBeenCalledWith(expect.objectContaining({tailLength: 1, pos: {x: 0, y: 0}}));
    });

    it('#addApple to given position', () => {
        board.setHead({x: 1, y: 1});
        expect(board.apples.length).toBe(0);
        board.addApple({x: 1, y: 2});
        expect(board.apples.length).toBe(1);
        expect(board.apples[0]).toEqual({x: 1, y: 2});

        board.addApple({x: 2, y: 2});
        expect(board.apples.length).toBe(2);
    });

    it('#addApple to random position, when no position given', () => {
        board.setHead({x: 2, y: 1});
        expect(board.apples.length).toBe(0);
        board.addApple();
        expect(board.apples.length).toBe(1);
        expect(board.apples[0]).toEqual({x: expect.any(Number), y: expect.any(Number)});
        expect(board.apples[0]).not.toEqual({x: 2, y: 1}); // the head
    });

    it('#addApple random does not spawn on tail', () => {
        board.setHead({x: 2, y: 1});
        board.addApple({x: 2, y: 2});
        board.move('DOWN'); // eat the apple to get tail length 1
        expect(board.tails.length).toBe(1);
        board.addApple();
        expect(board.apples[0]).not.toEqual({x: 2, y: 1}); // tail
        expect(board.apples[0]).not.toEqual({x: 2, y: 2}); // head
    });

    it('#clear resets head to null, tails to empty, apples to empty', () => {
        board.setHead({x: 2, y: 1});
        board.addApple({x: 2, y: 2});
        board.move('LEFT'); // just getting a tail defined
        board.move('DOWN');

        board.clear();
        expect(board.head).toBe(null);
        expect(board.tails.length).toBe(0);
        expect(board.apples.length).toBe(0);
    });

    it('#toString for fun and maybe logging', () => {
        board.setHead({x: 2, y: 1});
        board.addApple({x: 2, y: 2});
        board.move('DOWN'); // eat the apple to get tail length 1
        expect(board.tails.length).toBe(1);
        board.addApple({x: 1, y: 2});
        board.move('LEFT');
        board.addApple({x: 0, y: 0});
        // board.addApple();
        console.log(board.toString());
    });
});