import React from 'react';
import RCPagination from 'rc-pagination';
import PropTypes from 'prop-types';
import languages from '../languages';
import chevronLeft from '../assets/chevron-left.svg';
import chevronRight from '../assets/chevron-right.svg';
import more from '../assets/more.svg';

const Pagination = props => {
  const locale = languages[props.language || 'en_US'];

  return (
    <RCPagination
      prevIcon={<img className='fr-pagination-icon' src={chevronLeft} alt={locale.prev_page} />}
      nextIcon={<img className='fr-pagination-icon' src={chevronRight} alt={locale.next_page} />}
      jumpPrevIcon={<img className='fr-pagination-icon' src={more} />}
      jumpNextIcon={<img className='fr-pagination-icon' src={more} />}
      locale={locale}
      {...props}
    />
  );
};

Pagination.propTypes = {
  language: PropTypes.oneOf([
    'en_US',
    'es_ES',
    'fr_FR'
  ])
};

export default Pagination;
