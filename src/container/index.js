import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Base from '../base';
import Pagination from '../pagination';

class FeathersContainer extends Base {
  static propTypes = {
    emptyState: PropTypes.node,
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
    const { countTemplate, emptyState, hidePaginationOnSinglePage, itemsWrapper, language, paginationProps, renderItem, usePagination } = this.props;
    const { data, pagination } = this.state;
    const shouldShowPagination = hidePaginationOnSinglePage && pagination ? data.length >= pagination.pageSize : !!data.length;

    if (!data.length) return emptyState || null;

    return (
      <>
        {itemsWrapper && cloneElement(itemsWrapper, { children: data.map(renderItem) })}
        {!itemsWrapper && data.map(renderItem)}
        {usePagination && shouldShowPagination &&
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
      </>
    );
  }
}

export default FeathersContainer;
