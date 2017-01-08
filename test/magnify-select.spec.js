/* eslint-env node, mocha */

import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import MagnifySelect from '../app/magnify-select.jsx';

describe('<MagnifySelect>', function() {
  let wrapper;

  describe('#render', function() {
    it('renders', function() {
      wrapper = shallow(<MagnifySelect onchange={sinon.spy()} />);
      expect(wrapper.find(MagnifySelect)).to.be.ok;
    });

    it.skip('calls the onchange prop event handler', function() {
      const callback = sinon.spy();
      wrapper = mount(<MagnifySelect onchange={callback} />);

      wrapper.find('Dropdown').simulate('change', '5');   // this doesn't trigger the change event in react toolbox
      expect(callback.called).to.be.ok;
    });
  });
});
