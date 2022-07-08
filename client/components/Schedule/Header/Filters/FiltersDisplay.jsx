import PropTypes from 'prop-types';
import React from 'react';
import FilterPractitioners from './FilterPractitioners';
import FilterEntities from './FilterEntities';
import { Icon, SContainer, SHeader, SBody, Divider } from '../../../library';
import styles from './reskin-styles.scss';

export default function FiltersDisplay(props) {
  const {
    selectedFilters,
    entities,
    allChecked,
    handleAllCheck,
    handleEntityCheck,
    handleClearAll,
    handleSelectAll,
  } = props;
  const { chairsFilter, practitionersFilter } = selectedFilters;

  const isAnySelected = chairsFilter.length > 0 || practitionersFilter.length > 0;

  return (
    <SContainer className={styles.schedule_filter} noBorder>
      <SHeader className={styles.filter_header}>
        <div className={styles.filter_header__icon}>
          <Icon size={1.2} icon="filter" />
        </div>
        <div className={styles.filter_header__title}>Filters</div>
        <div className={styles.filter_header__link}>
          <button
            type="button"
            disabled={isAnySelected}
            className={styles.filter_header__link__selectText}
            onClick={handleSelectAll}
          >
            Select All
          </button>
          <button
            type="button"
            disabled={!isAnySelected}
            onClick={handleClearAll}
            className={styles.filter_header__link__clearText}
          >
            Clear All
          </button>
        </div>
      </SHeader>
      <Divider className={styles.divider} />
      <SBody className={styles.bodyContainer}>
        <div className={styles.filter_practitioner}>
          <FilterPractitioners
            filterKey="practitionersFilter"
            allChecked={allChecked.practitionersFilter}
            practitioners={entities.practitionersFilter}
            selectedFilterItem={selectedFilters.practitionersFilter}
            handleAllCheck={handleAllCheck}
            handleEntityCheck={handleEntityCheck}
          />
        </div>
        <Divider className={styles.divider} />
        <div className={styles.filter_practitioner}>
          <div className={styles.filter_options}>
            <FilterEntities
              display="name"
              label="Chairs:"
              filterKey="chairsFilter"
              allChecked={allChecked.chairsFilter}
              entities={entities.chairsFilter}
              selectedFilterItem={selectedFilters.chairsFilter}
              handleAllCheck={handleAllCheck}
              handleEntityCheck={handleEntityCheck}
            />
          </div>
        </div>
      </SBody>
    </SContainer>
  );
}

FiltersDisplay.propTypes = {
  selectedFilters: PropTypes.shape.isRequired,
  entities: PropTypes.shape.isRequired,
  allChecked: PropTypes.shape.isRequired,
  handleAllCheck: PropTypes.func.isRequired,
  handleEntityCheck: PropTypes.func.isRequired,
  handleClearAll: PropTypes.func.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
};
