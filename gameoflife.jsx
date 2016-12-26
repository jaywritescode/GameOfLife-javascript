import React from 'react';
import { Button } from 'react-toolbox/lib/button'

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
      survives: null
    };

    this.handleLoadBtnClick.bind(this);
  }

  handleLoadBtnClick(evt) {
    const rle = this.rleInput.value();
    if (rle == this.state.rle) {
      // go to the next state
    }
    else {
      try {
        const { grid, born, survives } = this.rleInput.parse();

        if (rle != this.state.rle) {
          this.setState({
            rle, grid, born, survives
          });
        }
      }
      catch(e) {
        console.log(e);
      }
    }
  }

  render() {
    return (
      <div>
        <Canvas />
        <RunLengthEncodingTextarea ref={(component) => this.rleInput = component} />
        <MagnifySelect />
        <SpeedSlider value={this.props.init_speed} />
        <Button
          id="loadBtn"
          label={this.isLoaded ? 'next' : 'generate'}
          onClick={(e) => this.handleLoadBtnClick(e)} />
        <Button label="run" />
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
