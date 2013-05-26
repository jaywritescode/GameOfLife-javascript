GameOfLife-javascript
=====================

Conway's Game of Life — Javascript + HTML5

How many languages can I write this in before getting sick of it? Three, that's how many!

This one gets embedded in some HTML:

    <script src="/js/game-of-life/gameoflife.js" type="text/javascript"></script>

Make that HTML5, since it looks for `document.getElementsByTagName('canvas').item(0)` and makes its art on that.

The API exposes eight functions via the global `GameOfLife` object.

### `load(/* String */ rle)`

Initializes the game and canvas with a seed pattern extracted from the given RLE.
