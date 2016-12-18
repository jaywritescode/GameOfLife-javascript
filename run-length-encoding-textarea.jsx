import React from 'react';

export default class RunLengthEncodingTextarea extends React.Component {
  render() {
    return (
      <textarea id="rle" {...this.props} />
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
