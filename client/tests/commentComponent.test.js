import React from 'react';
import {shallow} from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Comment from '../src/components/Comment';
import {mount} from 'enzyme';
import { expect } from 'chai';

Enzyme.configure({ adapter: new Adapter() });

test('Test Comment Component', () => {
    const commentText = shallow(<Comment text = "OK!" postId = "123" commentId = "123" datetime = {123} username="HandsomeJack"/>);
    expect(commentText.text()).to.equal('HandsomeJackOK!');
});

test('Allows us to set props', () => {
    const wrapper = mount(<Comment text = "OK!" postId = "123" commentId = "123" datetime = {123} username="HandsomeJack"/>);
    expect(wrapper.props().username).to.equal('HandsomeJack');
    expect(wrapper.props().text).to.equal('OK!');
    expect(wrapper.props().postId).to.equal('123');
    expect(wrapper.props().commentId).to.equal('123');
    wrapper.setProps({ text: 'NO!' });
    expect(wrapper.props().text).to.equal('NO!');

});
