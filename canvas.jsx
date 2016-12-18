import React from 'react';

export default class Canvas extends React.Component {
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
