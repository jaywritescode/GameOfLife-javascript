/* eslint-env node, mocha */

import React from 'react';
import { assert, expect } from 'chai';
import { mount, shallow } from 'enzyme';

var fs = require('fs');

import RunLengthEncodingTextarea from '../app/run-length-encoding-textarea.jsx';

describe('<RunLengthEncodingTextarea>', function() {

  describe('#render', function() {
    it('renders', function() {
      const wrapper = shallow(<RunLengthEncodingTextarea />);
      expect(wrapper.find(RunLengthEncodingTextarea)).to.be.ok;
    });
  });

  describe('#parse', function() {
    let wrapper, inst;

    beforeEach(function() {
      wrapper = mount(<RunLengthEncodingTextarea />);
      inst = wrapper.instance();
    });

    it("throws an error if there's no seed data", function() {
      wrapper.setState({
        rle: fs.readFileSync('patterns/no_seed_data.rle', 'utf8')
      });
      expect(inst.parse.bind(inst)).to.throw(Error, /No seed data/);
    });

    it('ignores comment lines', function() {
      wrapper.setState({
        rle: fs.readFileSync('patterns/comment_data_only.rle', 'utf8')
      });
      assert.throws(inst.parse.bind(inst), Error);                  // bdd style doesn't work here for some reason
      assert.doesNotThrow(inst.parse.bind(inst), /No seed data/);
    });

    describe('invalid header', function() {
      it('throws an error if the rows or columns are invalid', function() {
        wrapper.setState({
          rle: fs.readFileSync('patterns/bad_rows_value.rle', 'utf8')
        });
        expect(inst.parse.bind(inst)).to.throw(Error, /Invalid/);
      });

      it('throws an error if the rule string is invalid', function() {
        wrapper.setState({
          rle: fs.readFileSync('patterns/invalid_rule_string.rle', 'utf8')
        });
        expect(inst.parse.bind(inst)).to.throw(Error, /Invalid/);
      });
    });

    it('assumes the default rule string if none is given', function() {
      wrapper.setState({
        rle: fs.readFileSync('patterns/no_rule_string.rle', 'utf8')
      });

      const result = inst.parse.call(inst);
      expect(result).to.have.property('born').that.deep.equals([0, 0, 0, 1, 0, 0, 0, 0, 0]);
      expect(result).to.have.property('survives').that.deep.equals([0, 0, 1, 1, 0, 0, 0, 0, 0]);
    });

    it('parses the rule string', function() {
      wrapper.setState({
        rle: fs.readFileSync('patterns/non_standard_rule_string.rle', 'utf8')
      });

      const result = inst.parse.call(inst);
      expect(result).to.have.property('born').that.deep.equals([0, 0, 0, 1, 0, 0, 1, 0, 1]);
      expect(result).to.have.property('survives').that.deep.equals([0, 0, 1, 0, 1, 1, 0, 0, 0]);
    });

    it('parses the initial board state', function() {
      wrapper.setState({
        rle: fs.readFileSync('patterns/glider.rle', 'utf8')
      });
      expect(inst.parse.call(inst)).to.have.property('grid').that.deep.equals([[0, 1, 0], [0, 0, 1], [1, 1, 1]]);
    });
  });
});
