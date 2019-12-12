import React from 'react';
import {shallow} from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NarBar from '../src/components/NavBar';
import {mount} from 'enzyme';
import { expect } from 'chai';
import NavBar from '../src/components/NavBar';
import { render } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

test('Test NavBar Component', () => {
    const commentText = shallow(<NavBar currentUser='ass'/>);
    expect(commentText.text()).to.equal('');
});

// test('Allows us to set props', () => {
//     const wrapper = mount(<NarBar currentUser="HandsomeJack"/>);
//     expect(wrapper.props().currentUser).to.equal('HandsomeJack');
// });

// test('renders the title', () => {
//     const wrapper = render(<NarBar currentUser="HandsomeJack"/>);
//     expect(wrapper.text()).to.contain('');
//   });