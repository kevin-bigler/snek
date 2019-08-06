import Board from '../main/Board';

describe('Board but you know, visually', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board({width: 3, height: 3});
    });

    afterEach(jest.clearAllMocks);

    /**
     *
     * @param board
     * @param {string} state
     */
    const assertState = (board, state) => {
        expect(board.toString()).toBe(state.replace(/\s/, ''));
    };

    const startState = (width, height) =>
        Array(height).fill().map(() =>
            Array(width).fill().map(() => '_').join('.')).join('\n');

    it('startState helper works', () => {
        expect(startState(3, 3)).toEqual(`
_._._
_._._
_._._
        `);

        expect(startState(3, 2)).toEqual(`
_._._
_._._
        `.trim());

        expect(startState(2, 2)).toEqual(`
_._
_._
        `.trim());
    });

    describe('#move changes position when there is space and nothing in the way', () => {
        beforeEach(() => {
            board = new Board({width: 3, height: 3});
            assertState(board, startState(3, 3));

            board.setHead({x: 1, y: 1});

            assertState(board, `
_._._
_.O._
_._._
            `);
        });

        const testScenarios = [
            {
                dir: 'LEFT',
                state: `
_._._
O._._
_._._`
            },
            {
                dir: 'RIGHT',
                state: `
_._._
_._.O
_._._`
            },
            {
                dir: 'UP',
                state: `
_.O._
_._._
_._._`
            },
            {
                dir: 'DOWN',
                state: `
_._._
_._._
_.O._`
            },
        ];

        testScenarios.forEach(test =>
            it(test.dir, () => {
                board.move(test.dir);
                assertState(board, test.state);
            })
        );
    });
});