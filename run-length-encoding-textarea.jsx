import React from 'react';

const F = 0, T = 1;

const invalidRleMessage = "Invalid run-length encoding. Can't create seed pattern.";
const numberRegex = /[1-9]\d*/,
      ruleRegex = /B?([0-8]+)\/S?([0-8]+)/i;

export default class RunLengthEncodingTextarea extends React.Component {
  constructor(props) {
    super(props);
  }

  parse() {
    return RunLengthEncodingTextarea._doParse(this.value());
  }

  /**
   * @typedef {Object} GameProperties
   * @property {Array} grid The starting pattern
   * @property {Array} born An array, born[i] is truthy iff a dead
   *  cell becomes live when surrounded by i live cells
   * @property {Array} survives An array, survives[i] is truthy iff a
   *  live cell remains live when surrounded by i live cells
   */

  /**
   * Parses a Game of Life from the given run-length encoding.
   *
   * @static
   * @private
   * @return {GameProperties} the starting properties of the game
   */
  static _doParse(rle) {
    let grid = null,
        born = [F, F, F, F, F, F, F, F, F],
        survives = [F, F, F, F, F, F, F, F, F];

    if (rle.length < 1) {
      throw new Error('No seed data.');
    }

    let linearray, headerarray, rulearray, cells, rowGrid, columns, rows;

    // trim comments from the start and end of the RLE, then split by newlines
    linearray = rle.replace(/^#.*\n/gm, '').replace(/!.*/m, '').split('\n');

    // the header line is now the first line of linearray, split it by commas
    headerarray = linearray.shift().split(/,\s*/);

    columns = (numberRegex.exec(headerarray[0]) || [0])[0];
    rows = (numberRegex.exec(headerarray[1]) || [0])[0];
    if(columns < 1 || rows < 1) {
      throw new Error(invalidRleMessage);
    }

    if(headerarray[2]) {
      if(!(rulearray = ruleRegex.exec(headerarray[2]))) {
        throw new Error(invalidRleMessage);
      }

      // parse the rule string
      // create some temporary variables
      var i, j, a = (rulearray[1]).split('');     // rulearray[1] is the "born" part of the rule
      while((i = a.shift()) !== undefined) {
        born[i] = T;
      }
      a = (rulearray[2]).split('');               // rulearray[2] is the "survives" part of the rule
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
    grid = new Array();
    rowGrid = [];

    while((i = cells.match(/([1-9]\d*)?([bo\$])/i)) !== null) {
      if(i.index != 0) { throw new Error('Invalid RLE string.'); }

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

    return {
      grid: grid,
      born: born,
      survives: survives,
      rle: rle,
    };
  }

  value() {
    return this.textInput.value = this.textInput.value.trim();
  }

  render() {
    return (
      <textarea id="rle" ref={(component) => this.textInput = component} {...this.props} />
    );
  }
}

RunLengthEncodingTextarea.defaultProps = {
  placeholder: 'Enter run-length encoded seed pattern here.',
  cols: 70
};

RunLengthEncodingTextarea.propTypes = {
  placeholder: React.PropTypes.string,
  cols: React.PropTypes.number
};
