import React from 'react';
import { Slider } from 'react-toolbox/lib/slider';

export default class SpeedSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialSpeed
    }
  }

  handleChange(value) {
    console.log('handleChange');
    console.log(value);
    this.setState({
      value: value
    });
    this.props.onchange(value);
  }

  render() {
    return (
      <Slider value={this.state.value}
              onChange={this.handleChange.bind(this)}
              min={0}
              max={2000}
              step={50} />
    );
  }
}

SpeedSlider.propTypes = {
  onchange: React.PropTypes.func.isRequired,
  initialSpeed: React.PropTypes.number
};

SpeedSlider.defaultProps = {
  initialSpeed: 600
};
