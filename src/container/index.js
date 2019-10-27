import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Base from '../base';
import Pagination from '../pagination';

class FeathersContainer extends Base {
  static propTypes = {
    paginationProps: PropTypes.object,
    renderItem: PropTypes.func.isRequired,
    usePagination: PropTypes.bool
  };

  static defaultProps = {
    paginationProps: {}
  };

  render () {
    const { renderItem, usePagination, language, paginationProps, countTemplate } = this.props;
    const { data, pagination } = this.state;

    return (
      <Fragment>
        {data.map(renderItem)}
        {usePagination && !!data.length &&
          <Pagination
            onChange={this.pageChange}
            language={language}
            showTotal={(total, range) => {
              if (!countTemplate) return false;
              return countTemplate
                .replace('{start}', range[0])
                .replace('{end}', range[1])
                .replace('{total}', total)
            }}
            {...paginationProps}
            {...pagination} />
        }
      </Fragment>
    );
  }
}

export default FeathersContainer;
