import React from 'react';
import { shallow } from 'enzyme';
import Component from '.';

describe('<Column />', () => {
  it('displays data from row', () => {
    const wrapper = shallow(
      <Component
        dataSource='text'
        row={{ id: 1, text: 'Testing' }}
      />
    );

    expect(wrapper.text()).toBe('Testing');
  });

  it('uses a custom render prop', () => {
    const url = 'http://path.com/to/image.png';
    const wrapper = shallow(
      <Component
        dataSource='url'
        row={{ id: 1, url }}
        render={data => <img src={data} />}
      />
    );

    expect(wrapper.find('img')).toHaveLength(1);
    expect(wrapper.find('img').props().src).toBe(url);
  });
});
