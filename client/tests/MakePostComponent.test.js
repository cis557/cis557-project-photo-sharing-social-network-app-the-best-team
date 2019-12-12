import React from 'react';
import {shallow} from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Follow from '../src/components/Follow';
import {mount} from 'enzyme';
import { expect } from 'chai';
import { render } from 'enzyme';
import MakePost from '../src/components/MakePost';

Enzyme.configure({ adapter: new Adapter() });

// test('Test Follow Component', () => {
//     const commentText = shallow(<Follow currentUser="Tom"/>);
//     expect(commentText.text()).to.equal('');
// });

// test('Allows us to set props', () => {
//     const wrapper = mount(<Follow currentUser={true}/>);
//     expect(wrapper.props().currentUser).to.equal(true);
// });

test('Renders the MakePost', () => {
    const wrapper = render(<MakePost currentUser={true}/>);
    expect(wrapper.text()).to.contain('');
  });