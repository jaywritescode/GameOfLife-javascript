GameOfLife-javascript
=====================

Conway's Game of Life — Javascript + HTML5

How many languages can I write this in before getting sick of it? Three, that's how many!

### API

The script plunks the `GameOfLife` constructor function into the global environment. The constructor takes a single parameter: the `HTMLCanvasElement` element that Javascript draws the game state onto.

    <script type="text/javascript">
        var gameoflife = new GameOfLife(document.getElementsByTagName('canvas').item(0);
    </script>
    
The `GameOfLife` object exposes eight functions:

`load(/*String */ rle)`: Initializes the game by parsing the seed pattern and rules from the given run-length encoding and drawing the game's initial state. `var n = gameoflife.load(rle)` returns an object literal with the properties

+ `n.grid` is a two-dimensional array of boolean literals representing the game grid in the current state
+ `n.born` is an array of boolean literals such that `n.born[k]` obtains iff a dead cell with <var>k</var> live neighbors in iteration <var>i</var> becomes a live cell in iteration <var>i</var>&nbsp;+&nbsp;1
+ `n.survives` is similar to `n.born`: `n.survives[j]` obtains iff a live cell with <var>j</var> live neighbors in iteration <var>j</var> remains a live cell in iteration <var>j</var>&nbsp;+&nbsp;1

`next`: Computes the game's generation <var>i</var>&nbsp;+&nbsp;1 from generation <var>i</var> and re-draws the grid.

`run`: Starts the game running, computing the next iteration at regular intervals.

`stop`: Stops the game from running.

`set_speed(/* Number */ s)`: Sets the speed of the game, generating each subsequent iteration after <var>s</var> microseconds.

`set_magnify(/* Number */ m)`: Sets the canvas magnification such that each game cell is drawn as an <var>m</var>&nbsp;&times;&nbsp;<var>m</var> square on the canvas.

`is_loaded`: Returns true iff the game's initial pattern string is processed.

`is_running`: Returns true iff the game is running automically.
