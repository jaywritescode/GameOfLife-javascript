import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

var fs = require('fs');

import RunLengthEncodingTextarea from '../run-length-encoding-textarea.jsx';

describe('<RunLengthEncodingTextarea>', function() {

  describe('#render', function() {
    it('renders', function() {
      const wrapper = shallow(<RunLengthEncodingTextarea />);
      expect(wrapper.find(RunLengthEncodingTextarea)).to.be.ok;
    });
  });

  describe('#parse', function() {
    it("throws an error if there's no seed data", function() {
      const wrapper = shallow(<RunLengthEncodingTextarea />);
      const inst = wrapper.instance();
      wrapper.setState({
        value: ''
      });
      expect(inst.parse.bind(inst)).to.throw(Error, /No seed data/);
    });

    describe("invalid header", function() {
      it("throws an error if there's only comments in the RLE", function() {
        const wrapper = shallow(<RunLengthEncodingTextarea />);
        const inst = wrapper.instance();
        wrapper.setState({
          value: fs.readFileSync('patterns/commentsonly.rle', 'utf8')
        });
        expect(inst.parse.bind(inst)).to.throw(Error, /Invalid/);
      });

      it("throws an error if the header cannot be parsed", function() {
        const wrapper = shallow(<RunLengthEncodingTextarea />);
        const inst = wrapper.instance();
        wrapper.setState({
          value: fs.readFileSync('patterns/invalidheader.rle', 'utf8')
        });
        expect(inst.parse.bind(inst)).to.throw(Error, /Invalid/);
      });
    });
  });
});
