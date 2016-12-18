var T = 1, F = 0;

$(document).ready(function() {
     var gameoflife = new GameOfLife(document.getElementById('canvas'));
     var init_speed = 600;
     var __rle = document.getElementById('rle'),
         __nextBtn = document.getElementById('next_btn'),
         __runBtn = document.getElementById('run_btn');


     // set up the magnification select element
     $('#magnify').change( function() {
       gameoflife.set_magnify(parseInt(this.value));
     });

     // set up the speed slider element
     $('#speed').slider({
       min: 0,
       max: 2000,
       value: init_speed,
       step: 50,
       change: function(evt, ui) {
         $(this).prev().text(ui.value);
         gameoflife.set_speed(ui.value);
       }
     }).prev().text(init_speed);

     // since we have jQuery UI loaded, we might as well make pretty buttons
     $('#game_buttons button').button();

     // hook up the next/generate button
     $(__nextBtn).click(function() {
       try {
         if (!doLoad()) {
           return;
         }
       }
       catch(e) {
         alert(e);
         return;
       }

       gameoflife.next();
     });

     $(__runBtn).click(function() {
       try {
         doLoad();
       }
       catch(e) {
         alert(e);
         return;
       }

       var $txtEl = $('.ui-button-text > span', __runBtn),
           toggleClasses = 'icon-play icon-pause'

       if (!gameoflife.is_running()) {
         gameoflife.run();
         $txtEl.text('Stop').toggleClass(toggleClasses);
         __nextBtn.disabled = true;
       }
       else {
         gameoflife.stop();
         $txtEl.text('Run').toggleClass(toggleClasses);
         __nextBtn.disabled = false;
       }
     });

     function doLoad() {
       if (gameoflife.is_loaded()) {
         return true;
       }

       gameoflife.load(__rle.value);
       __rle.readOnly = true;
       $('.ui-button-text > span', __nextBtn).text('Next');    /* if we were using jQuery UI icons,
                                                                  we could just do $(__nextBtn).button({label: 'Next'}) */
       $(__runBtn).removeClass('hidden');
       return false;
     }








GameOfLife = function(el) {
    var grid,
        born,
        survives,
        rows,
        columns,
        iteration = 0,
        speed,
        magnify,
        xleft,
        ytop,
        timeoutId,
        running = false;

    var numberRegex = /[1-9]\d*/,
        ruleRegex = /(B([0-8]*)\/(S([0-8]*))|(([0-8]*))\/([0-8]*))/i;

    var invalidRleMessage = "Invalid run-length encoding. Can't create seed pattern.";

    /**
     * Load a game of life from the given RLE string.
     *
     * @param {String} rle The game of life in RLE.
     */
    function load(rle) {
        grid = undefined;
        born = [F, F, F, F, F, F, F, F, F];
        survives = [F, F, F, F, F, F, F, F, F];

        if(rle.length == 0) { throw new Error('No seed data.'); }

        var linearray, headerarray, rulearray, cells, rowGrid;

        // trim comments from the start and end of the RLE, then split by newlines
        linearray = rle.replace(/^#.*\n/gm, '').replace(/!.*/m, '').split('\n');

        // the header line is now the first line of linearray, split it by commas
        headerarray = linearray.shift().split(/,\s*/);

        try {
            columns = numberRegex.exec(headerarray[0])[0];
            rows = numberRegex.exec(headerarray[1])[0];
        }
        catch(e) {
            throw new Error(invalidRleMessage);
        }

        if(isNaN(columns) || isNaN(rows) || columns < 1 || rows < 1) {
            throw new Error(invalidRleMessage);
        }

        if(headerarray[2]) {
            if(!(rulearray = ruleRegex.exec(headerarray[2]))) {
                throw new Error(invalidRleMessage);
            }

            // parse the rule string
                    // create some temporary variables
            var i, j, a = (rulearray[2] || rulearray[7]).split('');         // rule[2] || rule[7] is the "born" part of the rule
            while((i = a.shift()) !== undefined) {
                born[i] = T;
            }
            a = (rulearray[3] || rulearray[6]).split('');                   // rule[3] || rule[6] is the "survives" part of the rule
            while((i = a.shift()) !== undefined) {
                survives[i] = T;
            }
        }
        else {
            born = [F, F, F, T, F, F, F, F, F];
            survives = [F, F, T, T, F, F, F, F, F];
        }

        // take the rest of the lines and concatenate them into one long string
        cells = linearray.reduce(function(a, b) { return a.concat(b); });
        grid = new Array(), rowGrid = [];

        // get the next [<count>?<tag?] regex in the string
        while((i = cells.match(/([1-9]\d*)?([bo\$])/i)) !== null) {
            if(i.index != 0) { throw new Error("Invalid RLE string."); }

            // if <count> is missing from the regex, then set it to one
            var count = i[1] || 1;

            // if <tag> is 'b' or 'o', then push 1's or 0's onto the row
            if(i[2] != '$') {
                while(count-- > 0) {
                    rowGrid.push(i[2] == 'o' ? T : F);
                }
            }
            // otherwise, move on to the next row...
            else {
                // ...but first pad out the current row
                while(rowGrid.length < columns) {
                    rowGrid.push(0);
                }
                grid.push(rowGrid);
                while(--count > 0) {
                    rowGrid = [];
                    for(j = columns; j > 0; --j) {
                        rowGrid.push(0);
                    }
                    grid.push(rowGrid);
                }
                rowGrid = [];
            }

            // remove the [<count>?<tag>] from the RLE string
            cells = cells.substr(i[0].length);
        }

        // pad out the final row
        while(rowGrid.length < columns) {
            rowGrid.push(0);
        }
        grid.push(rowGrid);

        xleft = -Math.floor(columns / 2);
        ytop = -Math.floor(rows / 2);

        _draw_grid();
        return {
            'grid': grid,
            'born': born,
            'survives': survives
        };
    };

    function _next() {
        var buffer = new Array(), cell;
        var r, c;

        _expandGrid();
        for(r = 0; r < rows; ++r) {
            for(c = 0; c < columns; ++c) {
                buffer.push({ 'row': r, 'column': c, 'state': grid[r][c] ? survives[_live_neighbors(r,c)] : born[_live_neighbors(r,c)]});
                if(buffer.length > columns + 2) {
                    cell = buffer.shift();
                    grid[cell.row][cell.column] = cell.state;
                }
            }
        }
        while(buffer.length > 0) {
            cell = buffer.shift();
            grid[cell.row][cell.column] = cell.state;
        }

        _trimGrid();
        ++iteration;
    };

    function next() {
        _next();
        _draw_grid();
    };

    function _live_neighbors(row, column) {
        var live_neighbors = 0, delta_r, delta_c;
        for(delta_r = -1; delta_r <= 1; ++delta_r) {
            if(row + delta_r < 0 || row + delta_r >= rows) {
                continue;
            }
            for(delta_c = -1; delta_c <= 1; ++delta_c) {
                if(column + delta_c < 0 || column + delta_c >= columns || (delta_r == 0 && delta_c == 0)) {
                    continue;
                }
                live_neighbors += grid[row + delta_r][column + delta_c];
            }
        }
        return live_neighbors;
    }

    function _expandGrid() {
        var c, r, min = (function() {
            for(var i = 0; i < 9; ++i) {
                if(born[i]) {
                    return i;
                }
            }
        }());
        if(min == 0) {
            throw new Error("Birth with 0 live neighbors confuses me.");
        }
        min = min || 4;

        if(min > 3) {
            return;
        }

        // iterate over every collection of three consecutive cells around the grid's border.
        // if at least "min" of each of them are live, then the game will spill over the border and we need a new row (column)
        if(rows >= min) {
                                    // this for statement just checks the first column in the grid and the last
            for(c = 0; c < columns; c += columns - 1) {
                for(r = 1; r < rows - 1; ++r) {
                    if(grid[r - 1][c] + grid[r][c] + grid[r + 1][c] >= min) {
                        for(r = 0; r < rows; ++r) {
                            if(c == 0) {
                                grid[r].unshift(0);
                            }
                            else {
                                grid[r].push(0);
                            }
                        }
                        if(c == 0) {
                            xleft--;
                        }
                        ++columns;
                        break;
                    }
                }
            }
        }
        if(columns >= min) {
            for(r = 0; r < rows; r += rows - 1) {
                for(c = 1; c < columns - 1; ++c) {
                    if(grid[r][c - 1] + grid[r][c] + grid[r][c + 1] >= min) {
                        var n = Array();
                        for(c = 0; c < columns; ++c) {
                            n[c] = 0;
                        }

                        if(r == 0) {
                            grid.unshift(n);
                            --ytop;
                        }
                        else {
                            grid.push(n);
                        }
                        ++rows;
                        break;
                    }
                }
            }
        }
    };

    function _trimGrid() {
        function _isFalse(val) { return val == F; }

        if(grid[0].every(_isFalse)) {
            grid.shift();
            --rows,
            --ytop;
        }
        if(grid[grid.length - 1].every(_isFalse)) {
            grid.pop();
            --rows;
        }
        if(grid.map(function(val, i, arr) { return val[0]; }).every(_isFalse)) {
            grid.forEach(function(val, i, arr) { val.shift(); });
            --columns;
            --xleft;
        }
        if(grid.map(function(val, i, arr) { return val[val.length - 1]; }).every(_isFalse)) {
            grid.forEach(function(val, i, arr) { val.pop(); });
            --columns;
        }
    };

    function run() {
        timeoutId = setInterval(function() {
            running = true;
            next();
        }, speed);
    };

    function stop() {
        running = false;
        if(timeoutId) {
            clearInterval(timeoutId);
        }
    };

    function set_speed(s) {
        if(s >= 0) {
            speed = s;
        }
    };

    /**
     * Sets the canvas magnification, then redraws the game.
     *
     * @param {Number} m The magnification level (x 100%)
     */
    function set_magnify(m) {
        if([1, 2, 4, 5, 8].indexOf(m) > -1) {
            magnify = m;
        }
        _draw_grid();
    };

    function _draw_grid() {
        var context, m = magnify || 1;
        if(!canvas || !canvas.getContext) {
            return;
        }

        context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        for(var y = canvas.height / 2 + (ytop * m), row = 0; row < rows; y += m, ++row) {
            for(var x = canvas.width / 2 + (xleft * m), col = 0; col < columns; x += m, ++col) {
                if(grid[row][col]) {
                    context.fillRect(x, y, m, m);
                }
            }
        }
    };

    return {
        'load': load,
        'next': next,
        'run': run,
        'stop': stop,
        'set_speed': set_speed,
        'set_magnify': set_magnify,
        'is_loaded': function() { return grid !== undefined; },
        'is_running': function() { return running; }
    };
};
