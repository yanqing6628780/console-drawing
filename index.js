const vorpal = require('vorpal')();

let X_BORDER = '-';
let Y_BORDER = '|';
let LINE_CHAR = 'x';
let curCanvasWidth, curCanvasHeight, curCanvasArr = [];
function drawCanvas(w, h) {
    let xLineW = new Array(w).fill(X_BORDER).join('');
    vorpal.log(xLineW);
    if (!curCanvasArr.length) {
        for (let i = 0; i < h; i++) {
            let row = new Array(w - 1).fill(' ');
            curCanvasArr.push(row);
        }
    }
    for (let index = 0; index < curCanvasArr.length; index++) {
        const row = curCanvasArr[index];
        vorpal.log(Y_BORDER + row.join('') + Y_BORDER);
    }
    vorpal.log(xLineW);
}
function redrawCanvas() {
    drawCanvas(curCanvasWidth, curCanvasHeight);
}
function isOutOfXBounds(x) {
    if (!curCanvasArr[0][x]) {
        vorpal.log('x is out of bounds', x);
        return true;
    }
    return false;
}
function isOutOfYBounds(y) {
    if (!curCanvasArr[y]) {
        vorpal.log('y is out of bounds', y);
        return true;
    }
    return false;
}
function checkXYisOutOfBounds(x1, y1, x2, y2) {
    let startCol = x1 - 1;
    let startRow = y1 - 1;
    let endRow = y2 - 1;
    if (isOutOfXBounds(startCol) ||
        isOutOfXBounds(x2) ||
        isOutOfYBounds(startRow) ||
        isOutOfYBounds(endRow)
    ) {
        return true;
    }
    return false;
}
function drawLine(x1, y1, x2, y2) {
    let startCol = x1 - 1;
    let startRow = y1 - 1;
    let endRow = y2 - 1;
    if (checkXYisOutOfBounds(x1, y1, x2, y2)) {
        return;
    }
    if (x1 > x2 || y1 > y2) {
        vorpal.log('(x2,y2) must gt (x1,y1)');
        return;
    }
    if (x1 === x2) {
        for (let index = startRow; index <= endRow; index++) {
            curCanvasArr[index][startCol] = LINE_CHAR;
        }
    } else if (y1 === y2) {
        for (let index = startCol; index < x2; index++) {
            curCanvasArr[startRow][index] = LINE_CHAR;
        }
    } else {
        vorpal.log('can`t not draw a line, please input correct x or y');
        return;
    }
    redrawCanvas();
}

function drawRectangle(x1, y1, x2, y2) {
    let startCol = x1 - 1;
    let endCol = x2;
    let startRow = y1 - 1;
    let endRow = y2 - 1;
    if (checkXYisOutOfBounds(x1, y1, x2, y2)) {
        return;
    }
    for (let index = startRow; index <= endRow; index++) {
        if (index === startRow || index === endRow) {
            curCanvasArr[index].fill(LINE_CHAR, startCol, endCol);
        } else {
            curCanvasArr[index][startCol] = LINE_CHAR;
            curCanvasArr[index][endCol-1] = LINE_CHAR;
        }
    }
    redrawCanvas();
}

function fill(x, y, colour) {
    if (x <= 0 ||
        x > curCanvasWidth ||
        y <= 0 ||
        y > curCanvasHeight ||
        curCanvasArr[y-1][x-1] === LINE_CHAR ||
        curCanvasArr[y-1][x-1] === colour
    ) {
        return;
    }

    curCanvasArr[y-1][x-1] = colour;

    fill(x+1, y, colour);
    fill(x-1, y, colour);
    fill(x, y+1, colour);
    fill(x, y-1, colour);
}

vorpal
    .command('C <w> <h>')
    .description('create a new canvas of width w and height h.')
    .action(function (args, done) {
        curCanvasArr = [];
        curCanvasWidth = args.w;
        curCanvasHeight = args.h;
        drawCanvas(args.w, args.h);
        done();
    });
vorpal
    .command('L <x1> <y1> <x2> <y2>', 'create a new rectangle, whose upper left corner is (x1,y1) and lower right corner is (x2,y2)')
    .action(function (args, done) {
        drawLine(args.x1, args.y1, args.x2, args.y2);
        done();
    });
vorpal
    .command('R <x1> <y1> <x2> <y2>', 'create a new rectangle, whose upper left corner is (x1,y1) and lower right corner is(x2, y2)')
    .action(function (args, done) {
        drawRectangle(args.x1, args.y1, args.x2, args.y2);
        done();
    });
vorpal
    .command('B <x> <y> <c>', 'Should fill the entire area connected to (x,y) with "colour" c.')
    .action(function (args, done) {
        fill(args.x, args.y, args.c);
        redrawCanvas();
        done();
    });

vorpal
    .command('Q', 'quit the program')
    .action(() => process.exit(0));

vorpal
    .delimiter('Drawing command$')
    .show();
