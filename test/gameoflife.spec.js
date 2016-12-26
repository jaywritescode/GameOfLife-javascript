import React from 'react';
import { assert, expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

var fs = require('fs');

import GameOfLife from '../gameoflife.jsx';

describe('<GameOfLife>', function() {

  describe('#render', function() {
    it('renders', function() {
      const wrapper = shallow(<GameOfLife />);
      expect(wrapper.find(GameOfLife)).to.be.ok;
    });
  });

  describe('#handleLoadBtnClick', function() {
    describe('not loaded and initialized', function() {
      it('loads the pattern', function() {
        const wrapper = mount(<GameOfLife />);
        assert.isNull(wrapper.state('rle'));

        const rle = fs.readFileSync('patterns/glider.rle', 'utf8'),
              grid = [[0, 0, 0], [1, 1, 1], [2, 2, 2]],
              born = [0, 0, 0, 0, 1, 1, 1, 1, 0],
              survives = [1, 1, 1, 1, 0, 0, 0, 0, 1];
        sinon.stub(wrapper.instance().rleInput, 'value').returns(rle);
        sinon.stub(wrapper.instance().rleInput, 'parse').returns({ grid, born, survives });
        var spy = sinon.spy(wrapper.instance(), 'setState');

        wrapper.find('#loadBtn').simulate('click');
        expect(spy.called).to.be.true;
      });
    });
  });
});
