import React from 'react';

export default class Canvas extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  /**
   * @typedef {Object} CanvasState
   * @property {Integer} xleft The left-most x-coordinate of the canvas
   * @property {Integer} ytop The top-most y-coordinate of the canvas
   * @property {Array} grid A two-dimensional array, grid[i][j] is truthy iff
   *  the cell at (i,j) is live
   * @property {Integer} magnify The current magnification level (x 100%)
   */

  /**
   * Draws the grid given the game state.
   *
   * @param {CanvasState} the state of the game
   */
  draw(state) {
    var context, m = state.magnify || 1;
    var canvas = document.getElementById('canvas');
    var rows = state.grid.length, columns = state.grid[0].length;

    if (!canvas || !canvas.getContext) {
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
  }

  render() {
    return (
      <canvas id="canvas" {...this.props} />
    );
  }
}

Canvas.propTypes = {
  height: React.PropTypes.number,
  width: React.PropTypes.number
};

Canvas.defaultProps = {
  height: 400,
  width: 400
};
