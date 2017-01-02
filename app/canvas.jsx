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
    const canvas = document.getElementById('canvas');
    const { ytop, xleft, grid, magnify } = state;

    if (!grid) {
      console.warn('CanvasState is undefined.');
      return;
    }

    const rows = grid.length,
          columns = grid[0].length;
    const m = magnify || 1;

    if (!canvas || !canvas.getContext) {
      return;
    }

    let context = canvas.getContext('2d');
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
      <canvas id="canvas" style={{border: '2px solid black'}} {...this.props} />
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
