import React from 'react';
import { Slider } from 'react-toolbox/lib/slider';

export default class SpeedSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialSpeed
    };
  }

  handleChange(value) {
    this.setState({
      value: value
    });
    this.props.onchange(value);
  }

  render() {
    return (
      <section>
        <p style={{fontSize: '1.2rem', lineHeight: '1.6rem', color: 'rgba(0, 0, 0, 0.26)'}}>speed</p>
        <Slider value={this.state.value}
                onChange={this.handleChange.bind(this)}
                min={0}
                max={2000}
                step={50} />
      </section>
    );
  }
}

SpeedSlider.propTypes = {
  onchange: React.PropTypes.func.isRequired,
  initialSpeed: React.PropTypes.number
};

SpeedSlider.defaultProps = {
  initialSpeed: 1400              // actual speed is slider.max - slider.value
};
