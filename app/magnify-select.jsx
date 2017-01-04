import React from 'react';
import { Dropdown } from 'react-toolbox/lib/dropdown';

export default class MagnifySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 1
    };
  }

  template(item) {
    return (
      <div>{`${item.value}\u00d7`}</div>
    );
  }

  handleChange(value) {
    this.setState({
      selected: value
    });
    this.props.onchange.call(value);
  }

  render() {
    return (
      <Dropdown auto={false}
                allowBlank={false}
                label="magnification"
                source={[{value: 1}, {value: 2}, {value: 4}, {value: 5}, {value: 8}]}
                template={this.template}
                onChange={this.handleChange.bind(this)}
                onFocus={() => {}}
                value={this.state.selected} />
    );
  }
}

MagnifySelect.propTypes = {
  onchange: React.PropTypes.func.isRequired,
}
