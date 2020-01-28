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
    query: PropTypes.object,
    renderItem: PropTypes.func.isRequired,
    separator: PropTypes.func,
    usePagination: PropTypes.bool
  };

  static defaultProps = {
    paginationProps: {}
  };

  render () {
    const {
      countTemplate,
      emptyState,
      hidePaginationOnSinglePage,
      itemsWrapper,
      language,
      paginationProps,
      query,
      renderItem,
      separator,
      usePagination
    } = this.props;
    const sections = [];
    const { data, pagination } = this.state;
    const shouldShowPagination = hidePaginationOnSinglePage &&
      pagination ? data.length >= pagination.pageSize : !!data.length;

    if (!data.length) return emptyState || null;

    if ((separator && !query.$sort) || (separator && !itemsWrapper)) {
      console.warn(`[feathers-react]: 'separator' prop requires both: a '$sort' property in your query, and the 'itemsWrapper' prop to be defined`);
      return null;
    }

    if (separator && query.$sort) {
      const sortProp = Object.keys(query.$sort)[0];

      data.forEach((item, index) => {
        const prevItem = data[index - 1];

        if (index === 0) {
          sections.push(separator(item));
          sections.push(cloneElement(itemsWrapper, { children: data.filter(i => i[sortProp] === item[sortProp]).map(renderItem) }));
        } else if (prevItem && item[sortProp] !== prevItem[sortProp]) {
          sections.push(separator(item));
          sections.push(cloneElement(itemsWrapper, { children: data.filter(i => i[sortProp] === item[sortProp]).map(renderItem) }));
        }
      });
    }

    return (
      <>
        {itemsWrapper && separator && sections.map((section, index) => cloneElement(section, { key: index }))}
        {itemsWrapper && !separator && cloneElement(itemsWrapper, { children: data.map(renderItem) })}
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
