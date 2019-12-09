import React, { cloneElement, Fragment } from 'react';
import PropTypes from 'prop-types';
import Base from '../base';
import Pagination from '../pagination';

class FeathersContainer extends Base {
  static propTypes = {
    hidePaginationOnSinglePage: PropTypes.bool,
    itemsWrapper: PropTypes.node,
    paginationProps: PropTypes.object,
    renderItem: PropTypes.func.isRequired,
    usePagination: PropTypes.bool
  };

  static defaultProps = {
    paginationProps: {}
  };

  render () {
    const { countTemplate, hidePaginationOnSinglePage, itemsWrapper, language, paginationProps, renderItem, usePagination  } = this.props;
    const { data, pagination } = this.state;
    const shouldShowPagination = hidePaginationOnSinglePage && pagination ? data.length >= pagination.pageSize : !!data.length;

    return (
      <Fragment>
        {itemsWrapper && cloneElement(itemsWrapper, { children: data.map(renderItem) })}
        {!itemsWrapper && data.map(renderItem)}
        {usePagination && shouldShowPagination &&
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
