import React from 'react';
import { mount } from 'enzyme';
import Component from '.';
import app from '../test-client';

const findById = (data, id) => data.find(message => message.id === id);
const findByText = (data, text) => data.find(message => message.text === text);

describe('<Base /> Component', () => {
  let service, wrapper, instance;

  beforeAll(done => {
    const query = {
      $search: 'Custom operator is ignored'
    };
    service = app.service('messages');
    wrapper = mount(
      <Component service={service} query={query} />
    );
    instance = wrapper.instance();

    instance.find()
      .then(() => {
        wrapper.update();
        done();
      });
  });

  it('handles real-time events', async () => {
    // Document removal
    expect(findById(wrapper.state().data, 'id-to-remove')).toBeTruthy();
    await service.remove('id-to-remove');
    wrapper.update();
    expect(findById(wrapper.state().data, 'id-to-remove')).toBeFalsy();

    // Document patching
    expect(findById(wrapper.state().data, 'id-to-patch').text).toBe('Patched message');
    await service.patch('id-to-patch', { text: 'feathers-react rocks!' });
    wrapper.update();
    expect(findById(wrapper.state().data, 'id-to-patch').text).toBe('feathers-react rocks!');

    // Document creation
    expect(findByText(wrapper.state().data, 'real-time woo!')).toBeFalsy();
    await service.create({ text: 'real-time woo!' });
    wrapper.update();
    expect(findByText(wrapper.state().data, 'real-time woo!').text).toBeTruthy();
  });

  it('a patched record not matching the query anymore is dropped (and vice versa)', async () => {
    const query = { author: 'Silvestre' };
    const wrapper = mount(
      <Component service={service} query={query} />
    );
    await wrapper.instance().find();
    const firstMessage = wrapper.state().data[0];
    expect(findById(wrapper.state().data, firstMessage.id)).toBeTruthy();
    await service.patch(firstMessage.id, { author: 'Someone Else' });
    wrapper.update();
    expect(findById(wrapper.state().data, firstMessage.id)).toBeFalsy();
    await service.patch(firstMessage.id, { author: 'Silvestre' });
    wrapper.update();
    expect(findById(wrapper.state().data, firstMessage.id)).toBeTruthy();
  });

  it('can go wrong', async () => {
    service.find = jest.fn().mockImplementation(() => Promise.reject(new Error('Nope')));
    expect(instance.find()).rejects.toThrow('Nope');
  });

  it('removes listeners on unmount', () => {
    const spy = jest.spyOn(instance.props.service, 'removeListener');
    instance.componentWillUnmount();
    expect(spy).toHaveBeenCalled();
  });

  it('calls a callback after fetching data', async () => {
    const spy = jest.fn();
    const wrapper = mount(<Component onDataChange={spy} service={service} />);
    await wrapper.instance().find();
    expect(spy).toHaveBeenCalled();
  });
});
