/* eslint-env node, mocha */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import MagnifySelect from '../magnify-select.jsx';

describe('<MagnifySelect>', function() {
  let wrapper, callback;

  before(function() {
    callback = sinon.spy();
  });

  beforeEach(function() {
    wrapper = shallow(<MagnifySelect onchange={callback} />);
  })

  describe('#render', function() {
    it('renders', function() {
      expect(wrapper.find(MagnifySelect)).to.be.ok;
    });

    it('calls the onchange prop event handler', function() {
      wrapper.find('select').simulate('change', '5');
      expect(callback.called).to.be.ok;
    });
  });
});
