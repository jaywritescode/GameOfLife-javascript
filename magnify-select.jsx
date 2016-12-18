import React from 'react';

export default class MagnifySelect extends React.Component {
  render() {
    return (
      <div>
        <label htmlFor="magnify">magnification</label>
        <select id="magnify" defaultValue="1">
          <option value="1">1&times;</option>
          <option value="2">2&times;</option>
          <option value="4">4&times;</option>
          <option value="5">5&times;</option>
          <option value="8">8&times;</option>
        </select>
      </div>
    );
  }
}
