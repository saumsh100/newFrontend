
import React, { Component, PropTypes } from 'react';
import FilterPractitioners from './FilterPractitioners';
import FilterEntities from './FilterEntities';
import { Card, Icon, SContainer, SHeader, SBody, } from '../../../library';
import styles from './styles.scss';

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

  return (
    <Card className={styles.schedule_filter}>
      <div className={styles.filter_header}>
        <div className={styles.filter_header__icon}>
          <Icon size={1.2} icon="filter" />
        </div>
        <div className={styles.filter_header__title}>
          Filters
        </div>
        <div className={styles.filter_header__link} >
          <div
            className={styles.filter_header__link__selectText}
            onClick={handleSelectAll}
          >
            Select All
          </div>
          <div
            onClick={handleClearAll}
            className={styles.filter_header__link__clearText}
          >Clear All
          </div>
        </div>
      </SHeader>
      <SBody className={styles.filter_practitioner}>
        <FilterPractitioners
          filterKey="practitionersFilter"
          allChecked={allChecked.practitionersFilter}
          practitioners={entities.practitionersFilter}
          selectedFilterItem={selectedFilters.practitionersFilter}
          handleAllCheck={handleAllCheck}
          handleEntityCheck={handleEntityCheck}
        />
        <div className={styles.filter_options}>
          {/*<FilterEntities
            display="name"
            label="Services"
            filterKey="servicesFilter"
            allChecked={allChecked.servicesFilter}
            entities={entities.servicesFilter}
            selectedFilterItem={selectedFilters.servicesFilter}
            handleAllCheck={handleAllCheck}
            handleEntityCheck={handleEntityCheck}
          />*/}
          <FilterEntities
            display="name"
            label="Chairs"
            filterKey="chairsFilter"
            allChecked={allChecked.chairsFilter}
            entities={entities.chairsFilter}
            selectedFilterItem={selectedFilters.chairsFilter}
            handleAllCheck={handleAllCheck}
            handleEntityCheck={handleEntityCheck}
          />
        </div>
      </SBody>
    </SContainer>
  );
}

FiltersDisplay.propTypes = {
  selectedFilters: PropTypes.object,
  entities: PropTypes.object,
  allChecked: PropTypes.object,
  handleAllCheck: PropTypes.func,
  handleEntityCheck: PropTypes.func,
  handleClearAll: PropTypes.func,
};
