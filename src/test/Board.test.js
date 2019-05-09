import Board from '../main/Board';

describe('Board', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board({width: 3, height: 3});
    });

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

});