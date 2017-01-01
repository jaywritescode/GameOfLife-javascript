import React from 'react';
import { Slider } from 'react-toolbox/lib/slider';

export default class SpeedSlider extends React.Component {
  render() {
    return (
      <Slider value={this.props.value} min={0} max={2000} step={50} />
    );
  }
}

SpeedSlider.propTypes = {
  value: React.PropTypes.number
};

SpeedSlider.defaultProps = {
  value: 600
};
