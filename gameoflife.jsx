import React from 'react';
import { Button } from 'react-toolbox/lib/button';

import Canvas from './canvas.jsx';
import RunLengthEncodingTextarea from './run-length-encoding-textarea.jsx';
import MagnifySelect from './magnify-select.jsx';
import SpeedSlider from './speed-slider.jsx';

export default class GameOfLife extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rle: null,
      grid: null,
      born: null,
      survives: null,
      isLoaded: false,
      iteration: 0,
      magnify: 1,
      xleft: null,
      ytop: null,
    };

    this.handleLoadBtnClick.bind(this);
    this.handleMagnifySelectChange.bind(this);
  }

  /****************************************************************************
   * lifecycle methods
   ***************************************************************************/
  componentDidUpdate(prevProps, prevState) {
    // TODO: this is not ideal
    if (prevState.magnify != this.state.magnify) {
      this.canvas.draw(this.state);
    }
  }

  /****************************************************************************
   * private methods
   ***************************************************************************/


  /****************************************************************************
   * event handlers
   ***************************************************************************/
  handleMagnifySelectChange(evt) {
    const magnify = +evt.target.value;
    if ([1, 2, 4, 5, 8].indexOf(magnify) > -1) {
      this.setState({
        magnify: magnify
      });
    }
  }

  handleLoadBtnClick(evt) {
    const rle = this.rleInput.value();
    if (rle == this.state.rle) {
      // go to the next state
    }
    else {
      try {
        const { grid, born, survives } = this.rleInput.parse();
        this.setState({
          rle: rle,
          grid: grid,
          born: born,
          survives: survives,
          isLoaded: true,
          iteration: 0,
          xleft: -Math.floor(grid[0].length / 2),
          ytop: -Math.floor(grid.length / 2),
        });
      }
      catch(e) {
        console.log(e);
      }
    }
  }

  render() {
    return (
      <div>
        <Canvas ref={(component) => this.canvas = component} />
        <RunLengthEncodingTextarea ref={(component) => this.rleInput = component} />
        <MagnifySelect onchange={(e) => this.handleMagnifySelectChange(e)} />
        <SpeedSlider value={this.props.init_speed} />
        <Button
          className='.loadBtn'
          label={this.state.isLoaded ? 'next' : 'generate'}
          onClick={(e) => this.handleLoadBtnClick(e)} />
        <Button label="run" disabled={!this.state.isLoaded} />
      </div>
    );
  }
}

GameOfLife.defaultProps = {
  init_speed: 600
};

GameOfLife.propTypes = {
  init_speed: React.PropTypes.number
};
