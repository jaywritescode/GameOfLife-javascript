GameOfLife-javascript
=====================

Conway's Game of Life — Javascript + HTML5

How many languages can I write this in before getting sick of it? Three, that's how many!

This one gets embedded in some HTML:

    <script src="/js/game-of-life/gameoflife.js" type="text/javascript"></script>

Make that HTML5, since it looks for `document.getElementsByTagName('canvas').item(0)` and makes its art on that.

***

The API exposes eight functions via the global `GameOfLife` object.

`load(/* String */ rle)`: Initializes the game and canvas with a seed pattern extracted from the given RLE. Returns `{'grid': g, 'born': b, 'survives': s}` where 

+ `g` is the game grid, represented as a two-dimensional array of boolean literals
+ `b` is an array of boolean literals such `b[k] == true` iff a dead cell with <var>k</var> live neighbors in iteration <var>i</var> becomes a live cell in iteration <var>i</var>&nbsp;+&nbsp;1
+ and `s` is an array of boolean literals such `s[k] == true` iff a live cell with <var>k</var> live neighbors in iteration <var>i</var> remains a live cell in iteration <var>i</var>&nbsp;+&nbsp;1.

`next`: Computes the game's generation <var>i</var>&nbsp;+&nbsp;1 from generation <var>i</var>.

`run`: Starts the game running automatically.

`stop`: Stops the game from running automatically.

`set_speed(/* Number */ s)`: Sets the speed of the game, generating each subsequent iteration after <var>s</var> microseconds.

`set_magnify(/* Number */ m)`: Sets the canvas magnification to any of 1x, 2x, 4x, 5x, or 8x, depending on <var>m</var>.

`is_loaded`: Returns true iff the game's initial pattern string is processed.

`is_running`: Returns true iff the game is running automically.

*** 

As I was too lazy to implement any sort of UI for this application, I had to implement a UI for this application. Here's the JavaScript + jQuery + jQuery UI that's embedded in my `game-of-life.html` page. Feel free to copy and modify:

    var __rle = document.getElementById('rle');
    var __nextBtn = document.getElementById('next_btn');
    var __runBtn = document.getElementById('run_btn');
    
    $(document).ready(function () {
      var init_value = 600;
      
      $('#magnify').change( function() {
        GameOfLife.set_magnify(parseInt(this.value));
      });
      
      $('#speed').slider({
        min: 0,
        max: 2000,
        value: init_value,
        step: 100,
        change: function(event, ui) {
          $(this).prev().text(ui.value);
          GameOfLife.set_speed(ui.value);
        }
      }).prev().text(init_value);
      
      $('#game_buttons').children().button();
      
      $(__nextBtn).click( function() {
        try {
          if(!doLoad()) {
            return;
          }
        }
        catch(e) {
          alert(e);
          return;
        }
          
        GameOfLife.next();
      });
      $(__runBtn).click( function() {
        try {
          doLoad();
        }
        catch(e) {
          alert(e);
          return;
        }
        
        if(!GameOfLife.is_running()) {
          GameOfLife.run();
          $('.ui-button-text', __runBtn).find(':eq(0)').text('Stop').next().toggleClass('ui-icon-play ui-icon-stop');
          __nextBtn.disabled = true;
        }
        else {
          GameOfLife.stop();
          $('.ui-button-text', __runBtn).find(':eq(0)').text('Run').next().toggleClass('ui-icon-play ui-icon-stop');
          __nextBtn.disabled = false;
        }
      });
        
      /**
       * @return true if the game is already loaded, false otherwise
       * @throws {Error} if the rle doesn't exist or is invalid
       */
      function doLoad() {
        if(GameOfLife.is_loaded()) {
          return true;
        }
          
        GameOfLife.load(__rle.value);
        __rle.readOnly = true;
        $('.ui-button-text', __nextBtn).find(':eq(0)').text('Next').next().removeClass('hidden');
        return false;
      }
    });
