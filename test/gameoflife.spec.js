/* eslint-env node, mocha */

import React from 'react';
import { assert, expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { Button } from 'react-toolbox/lib/button';

var fs = require('fs');

import GameOfLife from '../gameoflife.jsx';
import MagnifySelect from '../magnify-select.jsx';
import Canvas from '../canvas.jsx';

describe('<GameOfLife>', function() {

  describe('#render', function() {
    it('renders', function() {
      const wrapper = shallow(<GameOfLife />);
      expect(wrapper.find(GameOfLife)).to.be.ok;
    });
  });

  describe('#handleLoadBtnClick', function() {
    let wrapper, loadBtn;

    beforeEach(function() {
      wrapper = mount(<GameOfLife />);
      loadBtn = wrapper.find(Button).at(0);
    });

    describe('not loaded and initialized', function() {
      let rle, grid, born, survives;

      before(function() {
        rle = fs.readFileSync('patterns/glider.rle', 'utf8');
        grid = [[0, 0, 0], [1, 1, 1], [2, 2, 2]];
        born = [0, 0, 0, 0, 1, 1, 1, 1, 0];
        survives = [1, 1, 1, 1, 0, 0, 0, 0, 1];
      });

      beforeEach(function() {
        sinon.stub(wrapper.instance().rleInput, 'value').returns(rle);
        sinon.stub(wrapper.instance().rleInput, 'parse').returns({ grid, born, survives });
      });

      it('loads the pattern', function() {
        assert.isNull(wrapper.state('rle'));

        var spy = sinon.spy(wrapper.instance(), 'setState');

        loadBtn.simulate('click');
        expect(spy.called).to.be.true;
      });

      it('changes the "generate" button to "next"', function() {
        assert.equal(loadBtn.props().label, 'generate');

        loadBtn.simulate('click');
        expect(loadBtn.props().label).to.equal('next');
      });
    });
  });

  describe('#handleMagnifySelectChange', function() {
    let wrapper, select;

    beforeEach(function() {
      wrapper = mount(<GameOfLife />);
      select = wrapper.find('select');
    });

    it('changes the magnification level', function() {
      assert.equal(wrapper.state().magnify, 1);

      select.simulate('change', {target: {value: '5'}});
      expect(wrapper.state().magnify).to.eq(5);
    });

    it('passes the magnification onto the Canvas component', function() {
      assert.equal(wrapper.state().magnify, 1);

      const canvas = wrapper.find(Canvas).get(0);
      let spy = sinon.spy(canvas, 'draw');
      const nextState = { magnify: 5 };

      wrapper.setState(nextState);
      expect(spy.calledWith(sinon.match(nextState))).to.be.true;
    });
  });
});
