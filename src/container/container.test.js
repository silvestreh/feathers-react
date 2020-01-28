import React from 'react';
import { mount } from 'enzyme';
import Component from '.';
import app from '../test-client';

describe('<Container /> Component', () => {
  let service, wrapper, instance;

  beforeAll(() => {
    const query = { $sort: { text: 1 } };
    service = app.service('messages');
    wrapper = mount(
      <Component
        usePagination
        service={service}
        query={query}
        renderItem={(record, i) => <p key={i}>{record.text}</p>}
      />
    );
    instance = wrapper.instance();
  });

  it('renders data using a render function', async done => {
    expect(wrapper.find('p')).toHaveLength(0);
    await instance.find();
    wrapper.update();
    expect(wrapper.find('p')).toHaveLength(10);
    done();
  });

  it('counts documents in the response', async done => {
    const template = 'Showing {start} to {end} of {total}';
    const wrapper = mount(
      <Component
        usePagination
        countTemplate={template}
        service={service}
        renderItem={(record, i) => <p key={i}>{record.text}</p>}
      />
    );
    await wrapper.instance().find();
    wrapper.update();
    expect(wrapper.find('.rc-pagination-total-text').text()).toBe('Showing 1 to 10 of 15');
    done();
  });

  it('supports having a wrapper', async () => {
    const wrapper = mount(
      <Component
        itemsWrapper={<div className='wrapper-div' />}
        service={service}
        renderItem={(record, i) => <p key={i}>{record.text}</p>}
      />
    );
    await wrapper.instance().find();
    wrapper.update();
    const itemsWrapper = wrapper.find('.wrapper-div');
    expect(itemsWrapper).toHaveLength(1);
    expect(itemsWrapper.props().children).toHaveLength(10);
  });

  it('can group results based on a $sort query', async () => {
    const wrapper = mount(
      <Component
        itemsWrapper={<div className='wrapper-div' />}
        service={service}
        query={{ $sort: { author: 1 } }}
        separator={record => <h1>{record.author}</h1>}
        renderItem={(record, i) => <p key={i}>{record.text}</p>}
      />
    );
    await wrapper.instance().find();
    wrapper.update();
    expect(wrapper.find('h1')).toHaveLength(2);
    expect(wrapper.find({ children: 'Silvestre' })).toHaveLength(1);
    expect(wrapper.find({ children: 'Feathers' })).toHaveLength(1);
  });

  it('removes listeners on unmount', () => {
    const spy = jest.spyOn(instance.props.service, 'removeListener');
    instance.componentWillUnmount();
    expect(spy).toHaveBeenCalled();
  });
});
