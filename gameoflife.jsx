import React from 'react';
import { Button } from 'react-toolbox/lib/button'

import Canvas from './canvas.jsx';
import RunLengthEncodingTextarea from './run-length-encoding-textarea.jsx';
import MagnifySelect from './magnify-select.jsx';
import SpeedSlider from './speed-slider.jsx';


export default class GameOfLife extends React.Component {
  render() {
    return (
      <div>
        <Canvas />
        <RunLengthEncodingTextarea />
        <MagnifySelect />
        <SpeedSlider value={this.props.init_speed} />
        <Button label="blah" />
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
