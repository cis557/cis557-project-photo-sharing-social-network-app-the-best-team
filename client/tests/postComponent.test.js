import React from 'react';
import {mount} from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Profile from '../src/components/Profile';
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

test('allows us to set props', () => {
    const wrapper = mount(<Profile currentUser ='yt' />);
    expect(wrapper.props().currentUser).to.equal('yt');
});