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
  dataSource: PropTypes.string.isRequired,
  render: PropTypes.func,
  row: PropTypes.object.isRequired,
  title: PropTypes.string,
  width: PropTypes.number
};

export default Column;
