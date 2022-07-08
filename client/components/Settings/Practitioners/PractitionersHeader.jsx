import React from 'react';
import PropTypes from 'prop-types';
import { StandardButton as Button } from '../../library';
import styles from './styles.scss';
import PractitionerListFilter from './PractitionerListFilter';

const PractitionersHeader = ({ practitioners, setActive, listFilterProp }) => {
  const { filterName, updateFilter, practitionerCount } = listFilterProp;
  return (
    <div className={styles.servicesHeader}>
      <PractitionerListFilter
        practitioners={practitioners}
        filterName={filterName}
        updateFilter={updateFilter}
      >
        <div className={styles.servicesHeader_counter_badge}>{practitionerCount}</div>
      </PractitionerListFilter>
      <Button variant="primary" icon="plus" title="Add New Practitioner" onClick={setActive} />
    </div>
  );
};

PractitionersHeader.propTypes = {
  practitioners: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setActive: PropTypes.func.isRequired,
  listFilterProp: PropTypes.shape({
    filterName: PropTypes.string.isRequired,
    updateFilter: PropTypes.func.isRequired,
    practitionerCount: PropTypes.number.isRequired,
  }).isRequired,
};

export default PractitionersHeader;
