/*
 * samegame1k
 * js1k-2017 entry
 * @author Gabor Bata
 * @license MIT
 */

{
  let
  s, // score
  m; // number of marked tiles, -1: game over

  const
  // canvas size: 528 x 288
  WIDTH = 20,  // number of columns
  HEIGHT = 10, // number of rows
  TILE = 26,   // tile size in pixels
  STATUS = 20, // status bar height
  BORDER = 4,  // border size
  MARKER = 8,  // padding of marker rectangle

  table = [], // array of tiles
  canvas = window['a'],
  context = canvas.getContext('2d'),

  // calculate points by the formula: (m - 2) ^ 2
  points = () => m * m - 4 * m + 4,

  // get tile state - positive: base, negative: marked, zero: removed
  state = (x, y) =>
    x < 0 || y < 0 || x > WIDTH - 1 || y > HEIGHT - 1 ?
    0 : table[WIDTH * y + x],

  // reset values of the table with the given function (f), starts new game by default
  reset = (f = () => !(m = s = 0) && ~~(Math.random() * 4 + 1)) => {
    for (let v = WIDTH * HEIGHT; v--;) {
      table[v] = f(table[v]);
    }
  },

  // draw rectangle: if height (h) is not provided, the width (w) value will be used
  rect = (c, x, y, w, h = w) => {
    // color indices (c):
    // 0-4: base, removed tile (1) + tiles (4)
    // 5-9: darker, removed (1) + tiles (4)
    // 10-14: brigther, removed (1) + tiles (4)
    // 15: canvas background
    context.fillStyle = '#' + '336c65aba58cfb7113732555245753449f87eee9cffea224'.substr(c * 3, 3);
    context.fillRect(x, y, w, h);
  },

  // draw the canvas
  draw = () => {
    // canvas background
    rect(15, 0, 0, WIDTH * TILE + BORDER * 2, HEIGHT * TILE + BORDER * 2 + STATUS);

    // draw status bar
    context.font = '12px sans-serif';
    context.fillStyle = '#fff';
    context.fillText(
      `[New]    Score: ${s}    ` +
      (m > 1 ? `Marked: ${m} (+${points()})` : (m < 0 ? 'Game Over' : '')),
      BORDER * 2, HEIGHT * TILE + BORDER * 2 + STATUS / 2 + 2);

    // draw tiles
    for (let i = WIDTH; i--;) {
      for (let j = HEIGHT; j--;) {
        let c = Math.abs(state(i, j)), // color index
            h = state(i, j) < 0, // marked state of tile
            x = i * TILE + BORDER,
            y = j * TILE + BORDER;
        // add simple bevel effect
        rect(c + 5, x, y, TILE); // darker color (shadow)
        rect(c + 10, x, y, TILE - 1); // brighter color (light)
        rect(c + h * 10, x + 1, y + 1, TILE - 2); // base tile color
        // show marker rectangle
        if (h) {
          rect(c + 5, MARKER + x, MARKER + y, TILE - MARKER * 2);
        }
      }
    }
  },

  // mark tiles recursively
  mark = (x, y, c) =>
    state(x, y) <= 0 || c != state(x, y) ? 0 : // skip removed/marked or non-matching color
    (table[WIDTH * y + x] = -c) && // mark tile and check neighbors (non-zero values are considered true)
    1 + mark(x - 1, y, c) + mark(x, y - 1, c) + mark(x + 1, y, c) + mark(x, y + 1, c),

  // swap tiles based on the given coordinates
  swap = (x1, y1, x2, y2) => {
    let pos1 = WIDTH * y1 + x1,
        pos2 = WIDTH * y2 + x2,
        temp = table[pos1];
    table[pos1] = table[pos2];
    table[pos2] = temp;
  };

  // initialize game
  reset();
  draw();

  // define handler for mousedown event
  canvas.onmousedown = (event) => {
    // get coordinates of mouse event
    let c = canvas.getBoundingClientRect(),
        j = event.clientX - c.left,
        k = event.clientY - c.top;

    // handle click on the text '[New]'; 42 is the approximate width of the text
    // ...and also the "Answer to the Ultimate Question of Life, the Universe, and Everything"
    if (j < 42 && k > HEIGHT * TILE + BORDER * 2 && k < HEIGHT * TILE + BORDER * 2 + STATUS) {
      reset();
    }

    // normalize coordinates
    j = j < BORDER ? -1 : ~~((j - BORDER) / TILE);
    k = k < BORDER ? -1 : ~~((k - BORDER) / TILE);

    // check if tiles can be removed
    if (state(j, k) < 0 && m > 1) {
      // remove marked tiles
      reset(v => v < 0 ? 0 : v);

      // drop down tiles to fill the empty space
      for (j = WIDTH; j--;) {
        for (c = true; c;) {
          for (c = false, k = 1; k < HEIGHT; k++) {
            if (!state(j, k) && state(j, k - 1)) {
              swap(j, k, j, k - 1, c = true);
            }
          }
        }
      }

      // shift columns to the left
      for (c = true; c;) {
        for (c = false, j = 1; j < WIDTH; j++) {
          if (!state(j - 1, HEIGHT - 1) && state(j, HEIGHT - 1)) {
            for (c = true, k = HEIGHT; k--;) {
              swap(j, k, j - 1, k);
            }
          }
        }
      }

      // increase score based on the removed tiles
      s += points();

      // determine game end
      for (m = -1, j = WIDTH; j--;) {
        for (k = HEIGHT; k--;) {
          m = mark(j, k, state(j, k)) > 1 ? 0 : m;
        }
      }
    }

    // unmark tiles
    reset(Math.abs);

    // mark tiles if the event happened on an unmarked tile (i.e. j and k are non-negative),
    // or if there are still tiles to remove (m is non-negative)
    m = m < 0 ? m : mark(j, k, state(j, k));

    // redraw canvas
    draw();
  };
}
