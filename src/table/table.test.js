import React from 'react';
import { mount } from 'enzyme';
import Component from '.';
import Column from '../column';
import app from '../test-client';

describe('<Table /> Component', () => {
  const onRowClick = jest.fn();
  let service, wrapper, instance;

  beforeAll(() => {
    const query = { $sort: { text: 1 } };
    service = app.service('messages');
    wrapper = mount(
      <Component
        service={service}
        query={query}
        onRowClick={onRowClick}
      >
        <Column title='ID' dataSource='id' />
        <Column title='Text' dataSource='text' />
      </Component>
    );
    instance = wrapper.instance();
  });

  it('calls service find', async done => {
    expect(wrapper.find('Column')).toHaveLength(0);
    await instance.find();
    wrapper.update();
    expect(wrapper.find('Column')).toHaveLength(20);
    done();
  });

  it('works with an unpagianted response', async done => {
    const wrapper = mount(
      <Component service={app.service('not-paginated')}>
        <Column title='ID' dataSource='id' />
        <Column title='Text' dataSource='text' />
      </Component>
    );
    await wrapper.instance().find();
    wrapper.update();
    expect(wrapper.find('Column')).toHaveLength(20);
    done();
  });

  it('handles real-time events', async done => {
    // Document removal
    expect(wrapper.state().data.findIndex(m => m.id === 'id-to-remove')).toBeGreaterThan(-1);
    await service.remove('id-to-remove');
    wrapper.update();
    expect(wrapper.state().data.findIndex(message => message.id === 'id-to-remove')).toBe(-1);

    // Document patching
    await service.patch('id-to-patch', { text: 'feathers-react rocks!' });
    wrapper.update();
    expect(wrapper.find({ children: 'feathers-react rocks!' })).toHaveLength(1);

    // Document creation
    await service.create({ text: 'real-time woo!' });
    wrapper.update();
    expect(wrapper.find({ children: 'real-time woo!' })).toHaveLength(1);

    done();
  });

  it('can click a row', () => {
    const row = wrapper.find('tbody tr').first();
    expect(wrapper.find('.fr-table-row-clickable')).toHaveLength(10);
    expect(onRowClick).not.toHaveBeenCalled();
    row.simulate('click');
    expect(onRowClick).toHaveBeenCalled();
  });

  it('handles pagination', () => {
    const spy = jest.spyOn(instance, 'find');
    expect(spy).not.toHaveBeenCalled();
    expect(wrapper.find('Pager')).toHaveLength(2);
    const promise = Promise.resolve(instance.handlePageChange(2));

    return promise.then(() => {
      wrapper.update();
    }).then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('counts documents in the response', async done => {
    const template = 'Showing {start} to {end} of {total}';
    const wrapper = mount(
      <Component service={service} countTemplate={template}>
        <Column title='ID' dataSource='id' />
        <Column title='Text' dataSource='text' />
      </Component>
    );
    await wrapper.instance().find();
    wrapper.update();
    expect(wrapper.find('.rc-pagination-total-text').text()).toBe('Showing 1 to 10 of 15');
    done();
  });

  it('removes listeners on unmount', () => {
    const spy = jest.spyOn(instance.props.service, 'removeListener');
    instance.componentWillUnmount();
    expect(spy).toHaveBeenCalled();
  });
});
