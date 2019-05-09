import Board from './Board';

console.log('begin');
const board = new Board({width: 5, height: 2});

board.addEventListener('DIE', (data) => console.log('died', data));

board.clear();
board.setHead({x: 0, y: 0});
board.move('UP'); // should die

board.clear();
board.setHead({x: 0, y: 0});
board.move('DOWN');
board.move('DOWN'); // should die
//
// board.clear();
// board.setHead({x: 0, y: 0});
// board.move('LEFT'); // should die
//
// board.setHead({x: 0, y: 0});
// board.move('RIGHT');
// board.move('RIGHT');
// board.move('RIGHT'); // should die

// can't 180* turn (reverse directions)
board.clear();
board.setHead({x: 0, y: 0});
board.move('RIGHT');
board.move('RIGHT');
board.move('RIGHT');
board.move('LEFT'); // should die (goes right)

console.log('end');