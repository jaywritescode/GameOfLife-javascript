import 'react-toolbox/lib/commons.scss';

import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import { Layout, Panel } from 'react-toolbox/lib/layout';

import Canvas from './canvas.jsx';
import RunLengthEncodingTextarea from './run-length-encoding-textarea.jsx';
import MagnifySelect from './magnify-select.jsx';
import SpeedSlider from './speed-slider.jsx';

import theme from './gameoflife.scss';

export default class GameOfLife extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rle: null,
      born: null,
      survives: null,
      isLoaded: false,
      iteration: -1,
      magnify: 1,
      speed: 600,
      timeoutId: null
    };

    this.handleLoadBtnClick.bind(this);
    this.handleMagnifySelectChange.bind(this);
  }

  _initialize() {
    if (this.rleInput) {
      try {
        const { rle, grid, born, survives } = this.rleInput.parse();

        this._grid = grid;
        this.xleft = -Math.floor(grid[0].length / 2);
        this.ytop =  -Math.floor(grid.length / 2);
        this.setState({
          rle: rle,
          born: born,
          survives: survives,
          isLoaded: true,
          iteration: 0,
        });
      }
      catch(e) {
        console.log(e);
      }
    }
  }

  get grid() {
    return this._grid;
  }

  get rows() {
    return this.grid.length;
  }

  get columns() {
    return this.grid[0].length;
  }

  get xleft() {
    return this._xleft;
  }

  set xleft(value) {
    this._xleft = value;
  }

  get ytop() {
    return this._ytop;
  }

  set ytop(value) {
    this._ytop = value;
  }

  get rleInput() {
    return this._rleInput;
  }

  get isRunning() {
    return this.state.timeoutId != null;
  }

  next() {
    var buffer = new Array(), cell;
    var r, c;
    const { born, survives } = this.state;

    this._expandGrid();
    for(r = 0; r < this.rows; ++r) {
      for(c = 0; c < this.columns; ++c) {
        buffer.push({
          'row': r,
          'column': c,
          'state': this.grid[r][c] ? survives[this._live_neighbors(r,c)] : born[this._live_neighbors(r,c)]
        });
        if(buffer.length > this.columns + 2) {
          cell = buffer.shift();
          this.grid[cell.row][cell.column] = cell.state;
        }
      }
    }
    while(buffer.length > 0) {
      cell = buffer.shift();
      this.grid[cell.row][cell.column] = cell.state;
    }

    this._trimGrid();
    this.setState({
      iteration: this.state.iteration + 1
    });
  }

  /****************************************************************************
   * lifecycle methods
   ***************************************************************************/
  componentDidUpdate(prevProps, prevState) {
    const magnify = this.state.magnify;
    const newState = {
      grid: this.grid,
      magnify: magnify,
      xleft: this.xleft,
      ytop: this.ytop,
    };

    // TODO: this is not ideal
    if (prevState.iteration != this.state.iteration) {
      this.canvas.draw(newState);
    }
    if (prevState.magnify != this.state.magnify) {
      this.canvas.draw(newState);
    }
  }

  /****************************************************************************
   * private methods
   ***************************************************************************/
  _expandGrid() {
    const born = this.state.born;
    var c, r, min = born.indexOf(1);
    if(min < 0) {
      return;         // this pattern just dies
    }
    if(min == 0) {
      throw new Error("Birth with 0 live neighbors confuses me.");
    }
    min = min || 4;

    if(min > 3) {
      return;
    }

    // iterate over every collection of three consecutive cells around the grid's border.
    // if at least "min" of each of them are live, then the game will spill over the border and we need a new row (column)
    if(this.rows >= min) {
      // this for statement just checks the first column in the grid and the last
      for(c = 0; c < this.columns; c += this.columns - 1) {
        for(r = 1; r < this.rows - 1; ++r) {
          if(this.grid[r - 1][c] + this.grid[r][c] + this.grid[r + 1][c] >= min) {
            for(r = 0; r < this.rows; ++r) {
              if(c == 0) {
                this.grid[r].unshift(0);
              }
              else {
                this.grid[r].push(0);
              }
            }
            if(c == 0) {
              --this.xleft;
            }
            break;
          }
        }
      }
    }
    if(this.columns >= min) {
      for(r = 0; r < this.rows; r += this.rows - 1) {
        for(c = 1; c < this.columns - 1; ++c) {
          if(this.grid[r][c - 1] + this.grid[r][c] + this.grid[r][c + 1] >= min) {
            var n = Array();
            for(c = 0; c < this.columns; ++c) {
              n[c] = 0;
            }

            if(r == 0) {
              this.grid.unshift(n);
              --this.ytop;
            }
            else {
              this.grid.push(n);
            }
            break;
          }
        }
      }
    }
  }

  _trimGrid() {
    function _isFalse(val) { return !val; }

    if(this.grid[0].every(_isFalse)) {
      this.grid.shift();
      ++this.ytop;
    }
    if(this.grid[this.grid.length - 1].every(_isFalse)) {
      this.grid.pop();
    }
    if(this.grid.map(function(val, i, arr) { return val[0]; }).every(_isFalse)) {
      this.grid.forEach(function(val, i, arr) { val.shift(); });
      ++this.xleft;
    }
    if(this.grid.map(function(val, i, arr) { return val[val.length - 1]; }).every(_isFalse)) {
      this.grid.forEach(function(val, i, arr) { val.pop(); });
    }
  };

  _live_neighbors(row, column) {
    var live_neighbors = 0, delta_r, delta_c;
    const rows = this.rows,
          columns = this.columns;

    for(delta_r = -1; delta_r <= 1; ++delta_r) {
      if(row + delta_r < 0 || row + delta_r >= rows) {
        continue;
      }
      for(delta_c = -1; delta_c <= 1; ++delta_c) {
        if(column + delta_c < 0 || column + delta_c >= columns || (delta_r == 0 && delta_c == 0)) {
          continue;
        }
      live_neighbors += this.grid[row + delta_r][column + delta_c];
      }
    }
    return live_neighbors;
  }

  /****************************************************************************
   * event handlers
   ***************************************************************************/
  handleLoadBtnClick(evt) {
    const rle = this.rleInput.value();
    rle == this.state.rle ? this.next() : this._initialize(rle);
  }

  handleRunBtnClick(evt) {
    const { speed, timeoutId } = this.state;

    if (this.isRunning) {
      clearInterval(this.state.timeoutId);
      this.setState({
        timeoutId: null
      });
    }
    else {
      this.setState({
        timeoutId: setInterval(this.next.bind(this), speed)
      });
    }
  }

  handleMagnifySelectChange(value) {
    if ([1, 2, 4, 5, 8].indexOf(value) > -1) {
      this.setState({
        magnify: value
      });
    }
  }

  handleSpeedSliderChange(value) {
    const speed = 2000 - value;       // the slider: right = slower, feels unnatural
    let update = {
      speed: speed
    };
    if (this.isRunning) {
      clearInterval(this.state.timeoutId);
      Object.assign(update, {
        timeoutId: setInterval(this.next.bind(this), speed)
      });
    }
    this.setState(update);
  }

  render() {
    return (
      <Layout theme={theme}>
        <div id="left-column">
          <Canvas ref={(component) => this.canvas = component} />
        </div>
        <div id="right-column">
          <RunLengthEncodingTextarea ref={(component) => this._rleInput = component} />
          <MagnifySelect onchange={(e) => this.handleMagnifySelectChange(e)} />
          <SpeedSlider onchange={this.handleSpeedSliderChange.bind(this)} />
          <Button label={this.state.isLoaded ? 'next' : 'generate'}
                  onClick={(e) => this.handleLoadBtnClick(e)}
                  raised />
          <Button label={this.isRunning ? "pause" : "run"}
                  onClick={(e) => this.handleRunBtnClick(e)}
                  disabled={!this.state.isLoaded}
                  raised />
        </div>
      </Layout>
    );
  }
}

GameOfLife.defaultProps = {
  init_speed: 600
};

GameOfLife.propTypes = {
  init_speed: React.PropTypes.number
};
