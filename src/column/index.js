import React from 'react';
import PropTypes from 'prop-types';

const Column = ({ row, dataSource, render }) => {
  return (
    <td className='fr-table-content'>
      {
        typeof render === 'function'
          ? render(row[dataSource], row)
          : row[dataSource]
      }
    </td>
  );
};

Column.displayName = 'Column';

Column.propTypes = {
  dataSource: function (props, propName, componentName) {
    if (typeof props.render !== 'function' && typeof props[propName] !== 'string') {
      return new Error(
        'Invalid ' + propName + ' supplied to ' + componentName +
        '. ' + propName + ' is required, unless a render prop is supplied.'
      );
    }
  },
  render: PropTypes.func,
  row: PropTypes.object,
  title: PropTypes.string,
  width: PropTypes.number
};

export default Column;
