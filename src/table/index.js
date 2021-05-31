import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import inbox from '../assets/inbox.svg';
import Pagination from '../pagination';
import FeathersReact from '../base';
import languages from '../languages';

class Table extends FeathersReact {
  static propTypes = {
    countTemplate: PropTypes.string,
    paginationProps: PropTypes.object,
    usePagination: PropTypes.bool
  };

  handleSortClick = column => () => {
    const { $sort } = this.state;

    if (typeof $sort[column.dataSource] === 'number') {
      this.setState({ $sort: { [column.dataSource]: $sort[column.dataSource] > 0 ? -1 : 1 } }, this.find);
    } else {
      this.setState({ $sort: { [column.dataSource]: 1 } }, this.find);
    }
  };

  render () {
    const { data, isLoading, pagination, $sort } = this.state;
    const {
      children,
      keyProp,
      language,
      usePagination = true,
      onRowClick,
      countTemplate,
      paginationProps,
      sortable
    } = this.props;

    return (
      <div className='fr-table-wrapper'>
        <table className='fr-table'>
          <thead className='fr-table-head'>
            <tr>
              {Children.map(children, (child, i) => (
                child &&
                  <th
                    key={i}
                    className='fr-table-content'
                    width={child.props.width}
                  >
                    <button
                      className='fr-table-column-sorting-button'
                      onClick={sortable ? this.handleSortClick(child.props) : undefined}
                      style={{ cursor: sortable ? 'pointer' : 'default' }}>
                      <span className='fr-table-column-title'>
                        {child.props.title}
                      </span>
                      {$sort && $sort[child.props.dataSource] &&
                        <span
                          className='fr-table-column-sorting-indicator' style={{
                            transform: $sort[child.props.dataSource] > 0
                              ? 'none'
                              : 'rotate(180deg)'
                          }}
                        >
                          <span>▴</span>
                        </span>}
                    </button>
                  </th>
              ))}
            </tr>
          </thead>
          <tbody className='fr-table-body'>
            {!data.length &&
              <tr>
                <td className='fr-table-no-data' colSpan={Children.count(children)}>
                  <img src={inbox} alt={languages[language].no_data} />
                  {languages[language].no_data}
                </td>
              </tr>}
            {data.map((row, index) => (
              <tr
                key={row[keyProp]}
                onClick={() => onRowClick(row, index)}
                className='fr-table-row fr-table-row-clickable'
              >
                {Children.map(children, child => (
                  child && cloneElement(child, { row, key: keyProp })
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className='fr-table-footer'>
            <tr>
              <td className='fr-table-content' colSpan={Children.toArray(children).filter(child => child !== null).length}>
                {usePagination && !!data.length &&
                  <Pagination
                    onChange={this.handlePageChange}
                    language={language}
                    showTotal={(total, range) => {
                      if (!countTemplate) return false;
                      return countTemplate
                        .replace('{start}', range[0])
                        .replace('{end}', range[1])
                        .replace('{total}', total);
                    }}
                    {...paginationProps}
                    {...pagination}
                  />}
              </td>
            </tr>
          </tfoot>
        </table>
        {isLoading && <div className='fr-table-loading' />}
      </div>
    );
  }
}

export default Table;
