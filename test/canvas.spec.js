/* eslint-env node, mocha */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Canvas from '../app/canvas.jsx';

describe('<Canvas>', function() {
  describe('#render', function() {
    it('renders', function() {
      const wrapper = shallow(<Canvas />);
      expect(wrapper.find(Canvas)).to.be.ok;
    });
  });
});
