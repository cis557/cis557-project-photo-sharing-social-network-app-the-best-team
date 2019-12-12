import React from 'react';
import {shallow} from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Like from '../src/components/Like';
import {mount} from 'enzyme';
import { expect } from 'chai';
import { render } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

test('Test Like Component', () => {
    const commentText = shallow(<Like currentUser='ass'/>);
    expect(commentText.text()).to.equal('');
});

// test('Allows us to set props', () => {
//     const wrapper = mount(<NarBar currentUser="HandsomeJack"/>);
//     expect(wrapper.props().currentUser).to.equal('HandsomeJack');
// });

// test('Renders the Like Button', () => {
//     const wrapper = render(<NarBar currentUser="HandsomeJack"/>);
//     expect(wrapper.text()).to.contain('');
//   });