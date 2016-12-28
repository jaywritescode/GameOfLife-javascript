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
    let wrapper, loadBtn, runBtn, canvas;
    let inst;

    beforeEach(function() {
      wrapper = mount(<GameOfLife />);
      loadBtn = wrapper.find(Button).at(0);
      runBtn = wrapper.find(Button).at(1);
      canvas = wrapper.find(Canvas).get(0);

      inst = wrapper.instance();
    });

    describe('not loaded and initialized', function() {
      let rle, grid, born, survives;

      before(function() {
        rle = fs.readFileSync('patterns/cow.rle', 'utf8');
        grid = [
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          ];
        born = [0, 0, 0, 0, 1, 1, 1, 1, 0];
        survives = [1, 1, 1, 1, 0, 0, 0, 0, 1];
      });

      beforeEach(function() {
        sinon.stub(inst.rleInput, 'value').returns(rle);
        sinon.stub(inst.rleInput, 'parse').returns({ grid, born, survives });
      });

      it('loads the pattern', function() {
        assert.isNull(wrapper.state('rle'));

        var spy = sinon.spy(inst, 'setState');

        loadBtn.simulate('click');
        expect(spy.called).to.be.true;
      });

      it('sets the boundaries of the canvas', function() {
        loadBtn.simulate('click');
        expect(wrapper.state().xleft).to.eq(-20);
        expect(wrapper.state().ytop).to.eq(-3);
      });

      it('changes the "generate" button to "next"', function() {
        assert.equal(loadBtn.props().label, 'generate');

        loadBtn.simulate('click');
        expect(loadBtn.props().label).to.equal('next');
      });

      it('enables the "run" button', function() {
        assert.isTrue(runBtn.props().disabled);

        loadBtn.simulate('click');
        expect(runBtn.props().disabled).to.be.false;
      });

      it('draws the game on the canvas', function() {
        var stub = sinon.stub(canvas, 'draw');

        loadBtn.simulate('click');
        expect(stub.called).to.be.true;
      });
    });

    describe('loaded and initialized', function() {
      let rle;

      before(function() {
        rle = fs.readFileSync('patterns/cow.rle', 'utf8');
      });

      beforeEach(function() {
        sinon.stub(inst.rleInput, 'value').returns(rle);
        wrapper.setState({
          rle: rle
        });
      });

      it('generates the next iteration of the pattern', function() {
        assert(rle == inst.state.rle);

        var spy = sinon.spy(inst, 'next');

        loadBtn.simulate('click');
        expect(spy.called).to.be.true;
      });
    });
  });

  describe('#handleMagnifySelectChange', function() {
    let wrapper, select, canvas, stub;

    beforeEach(function() {
      wrapper = mount(<GameOfLife />);
      select = wrapper.find('select');
      canvas = wrapper.find(Canvas).get(0);
      stub = sinon.stub(canvas, 'draw');
    });

    it('changes the magnification level', function() {
      assert.equal(wrapper.state().magnify, 1);

      select.simulate('change', {target: {value: '5'}});
      expect(wrapper.state().magnify).to.eq(5);
    });

    it('passes the magnification onto the Canvas component', function() {
      assert.equal(wrapper.state().magnify, 1);

      const nextState = { magnify: 5 };

      wrapper.setState(nextState);
      expect(stub.calledWith(sinon.match(nextState))).to.be.true;
    });
  });
});
