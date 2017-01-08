/* eslint-env node, mocha */

import React from 'react';
import { assert, expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { Button } from 'react-toolbox/lib/button';

var fs = require('fs');

import GameOfLife from '../app/gameoflife.jsx';
import MagnifySelect from '../app/magnify-select.jsx';
import RunLengthEncodingTextarea from '../app/run-length-encoding-textarea.jsx';
import Canvas from '../app/canvas.jsx';
import SpeedSlider from '../app/speed-slider.jsx';

const cow = {
  rle: fs.readFileSync('patterns/cow.rle', 'utf8'),
  grid: [
    [1,1,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0],
    [1,1,0,0,0,0,1,0,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,1,1],
    [0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [1,1,0,0,0,0,1,0,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
    [1,1,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0]
  ],
  born: [0,0,0,1,0,0,0,0,0],
  survives: [0,0,1,1,0,0,0,0,0]
};
const glider = {
  rle: fs.readFileSync('patterns/glider.rle', 'utf8'),
  grid: [
    [0,1,0],
    [0,0,1],
    [1,1,1]
  ],
  born: [0,0,0,1,0,0,0,0,0],
  survives: [0,0,1,1,0,0,0,0,0]
};
const pufferfish = {
  rle: fs.readFileSync('patterns/pufferfish.rle', 'utf8'),
  grid: [
    [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    [0,0,1,1,1,0,0,0,0,0,1,1,1,0,0],
    [0,1,1,0,0,1,0,0,0,1,0,0,1,1,0],
    [0,0,0,1,1,1,0,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
    [0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],
    [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,1,0,0,0,0,1,0,1,0,0,0,0,1,1],
    [0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
    [0,0,0,1,0,1,0,0,0,1,0,1,0,0,0],
    [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0]
  ],
  born: [0,0,0,1,0,0,0,0,0],
  survives: [0,0,1,1,0,0,0,0,0]
};

describe('<GameOfLife>', function() {
  describe('#render', function() {
    it('renders', function() {
      const wrapper = shallow(<GameOfLife />);
      expect(wrapper.find(GameOfLife)).to.be.ok;
    });
  });

  describe('#next', function() {
    let wrapper, inst;

    const { rle, grid, born, survives } = glider;

    const glider_states = [
      { grid: [[0, 1, 0], [0, 0, 1], [1, 1, 1]], xleft: -1, ytop: -1 },
      { grid: [[1, 0, 1], [0, 1, 1], [0, 1, 0]], xleft: -1, ytop: -2 },
      { grid: [[0, 0, 1], [1, 0, 1], [0, 1, 1]], xleft: -1, ytop: -2 },
      { grid: [[1, 0, 0], [0, 1, 1], [1, 1, 0]], xleft: -2, ytop: -2 },
      { grid: [[0, 1, 0], [0, 0, 1], [1, 1, 1]], xleft: -2, ytop: -2 },
    ]

    beforeEach(function() {
      wrapper = mount(<GameOfLife />);
      inst = wrapper.instance();

      sinon.stub(inst.rleInput, 'value').returns(rle);

      inst._initialize();
    });

    it('generates the next iteration', function() {
      assert.deepEqual(glider_states[0].grid, inst.grid);
      assert.equal(glider_states[0].xleft, inst.xleft);
      assert.equal(glider_states[0].ytop, inst.ytop);

      let newState;
      for(var i = 1; i < glider_states.length; ++i) {
        inst.next();

        newState = wrapper.state();
        expect(newState.iteration).to.equal(i);
        expect(inst.grid).to.deep.equal(glider_states[i].grid);
        expect(inst.xleft).to.equal(glider_states[i].xleft);
        expect(inst.ytop).to.equal(glider_states[i].ytop);
      }
    });

    it('re-draws the next generation', function() {
      let canvas = wrapper.find(Canvas).get(0);
      let spy = sinon.spy(canvas, 'draw');

      inst.next();
      expect(spy.called).to.be.true;
    });
  });

  describe('#handleLoadBtnClick', function() {
    let wrapper, loadBtn, runBtn, canvas;
    let inst;

    const { rle, grid, born, survives } = cow;

    beforeEach(function() {
      wrapper = mount(<GameOfLife />);
      loadBtn = wrapper.find(Button).at(0);
      runBtn = wrapper.find(Button).at(1);
      canvas = wrapper.find(Canvas).get(0);

      inst = wrapper.instance();
    });

    describe('not loaded and initialized', function() {
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
        expect(wrapper.instance().xleft).to.eq(-20);
        expect(wrapper.instance().ytop).to.eq(-3);
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
      beforeEach(function() {
        sinon.stub(inst.rleInput, 'value').returns(rle);

        wrapper.instance()._grid = cow.grid;
        wrapper.instance().xleft = -Math.floor(cow.grid[0].length / 2);
        wrapper.instance().ytop = -Math.floor(cow.grid.length / 2);
        wrapper.setState(Object.assign(cow, {
          isLoaded: true,
          iteration: 0
        }));
      });

      it('generates the next iteration of the pattern', function() {
        assert(rle == inst.state.rle);

        var spy = sinon.spy(inst, 'next');

        loadBtn.simulate('click');
        expect(spy.called).to.be.true;
      });
    });
  });

  describe('#handleRunBtnClick', function() {
    let wrapper, runBtn;
    let inst;
    let clock;

    const { rle, grid, born, survives } = cow;

    before(function() {
      this.clock = sinon.useFakeTimers();
    });

    beforeEach(function() {
      wrapper = mount(<GameOfLife />);
      runBtn = wrapper.find(Button).at(1);

      inst = wrapper.instance();

      sinon.stub(inst.rleInput, 'value').returns(rle);

      inst._grid = cow.grid;
      inst.xleft = -Math.floor(cow.grid[0].length / 2);
      inst.ytop = -Math.floor(cow.grid.length / 2);
      wrapper.setState({
        rle: cow.rle,
        born: cow.born,
        survives: cow.survives,
        isLoaded: true,
        iteration: 0
      });
    });

    after(function() {
      this.clock.restore();
    });

    describe.skip('running', function() {
      it('pauses the game', function() {

      });

      it('changes the button label to "run"', function() {

      });
    });

    describe('paused', function() {
      it('starts the game', function() {
        assert.isFalse(runBtn.props().disabled);

        let spy = sinon.spy(wrapper.instance(), 'next');
        runBtn.simulate('click');

        expect(wrapper.state().isRunning).to.be.true;
        expect(wrapper.state().timeoutId).to.not.be.null;

        this.clock.tick(wrapper.state().speed);
        expect(spy.called).to.be.true;
      });

      it('changes the button label to "pause"', function() {
        assert.equal(runBtn.props().label, 'run');

        runBtn.simulate('click');
        expect(runBtn.props().label).to.eq('pause');
      });
    });
  })

  describe('#handleMagnifySelectChange', function() {
    let wrapper, select, canvas, stub;

    beforeEach(function() {
      wrapper = mount(<GameOfLife />);
      select = wrapper.find('select');
      canvas = wrapper.find(Canvas).get(0);
      stub = sinon.stub(canvas, 'draw');
    });

    it.skip('changes the magnification level', function() {
      assert.equal(wrapper.state().magnify, 1);

      select.simulate('change', {target: {value: '5'}});    // this doesn't work with react toolbox
      expect(wrapper.state().magnify).to.eq(5);
    });

    it('passes the magnification onto the Canvas component', function() {
      assert.equal(wrapper.state().magnify, 1);

      const nextState = { magnify: 5 };

      wrapper.setState(nextState);
      expect(stub.calledWith(sinon.match(nextState))).to.be.true;
    });
  });

  describe.skip('#handleSpeedSliderChange', function() {
    let wrapper, slider;

    beforeEach(function() {
      wrapper = mount(<GameOfLife />);
      slider = wrapper.find('SpeedSlider').at(0);
    });

    it('updates the game speed', function() {

    });
  });
});
