import React from 'react';
import Pagination from 'rc-pagination';
import languages from '../languages';
import chevronLeft from '../assets/chevron-left.svg';
import chevronRight from '../assets/chevron-right.svg';
import more from '../assets/more.svg';

export default props => {
  const locale = languages[props.language || 'en_US'];

  return (
    <Pagination
      prevIcon={<img className="fr-pagination-icon" src={chevronLeft} alt={locale.prev_page} />}
      nextIcon={<img className="fr-pagination-icon" src={chevronRight} alt={locale.next_page} />}
      jumpPrevIcon={<img className="fr-pagination-icon" src={more} />}
      jumpNextIcon={<img className="fr-pagination-icon" src={more} />}
      locale={locale}
      {...props} />
  );
};
