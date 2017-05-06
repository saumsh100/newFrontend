
import React, { Component, PropTypes } from 'react';
import FilterPractitioners from './FilterPractitioners';
import FilterCheckbox from './FilterCheckbox';
import { Card, Icon } from '../../../library';
import styles from './styles.scss';

export default function FiltersDisplay(props) {
  const {
    selectedFilters,
    entities,
    allChecked,
    handleAllCheck,
    handleEntityCheck,
  } = props;

  return (
    <Card className={styles.schedule_filter}>
      <div className={styles.filter_header}>
        <div className={styles.filter_header__title}>
          Filter
        </div>
        <div className={styles.filter_header__icon}>
          <Icon icon="sliders" />
        </div>
        <div className={styles.filter_header__link}>Clear All</div>
      </div>
      <div className={styles.filter_practitioner}>
        <FilterPractitioners
          filterKey="practitionersFilter"
          allChecked={allChecked.practitionersFilter}
          practitioners={entities.practitionersFilter}
          selectedFilterItem={selectedFilters.practitionersFilter}
          handleAllCheck={handleAllCheck}
          handleEntityCheck={handleEntityCheck}
        />
        <div className={styles.filter_options}>
          <FilterCheckbox
            label="Services"
            filterKey="servicesFilter"
            allChecked={allChecked.servicesFilter}
            entities={entities.servicesFilter}
            selectedFilterItem={selectedFilters.servicesFilter}
            handleAllCheck={handleAllCheck}
            handleEntityCheck={handleEntityCheck}
          />
          <FilterCheckbox
            label="Chairs"
            filterKey="chairsFilter"
            allChecked={allChecked.chairsFilter}
            entities={entities.chairsFilter}
            selectedFilterItem={selectedFilters.chairsFilter}
            handleAllCheck={handleAllCheck}
            handleEntityCheck={handleEntityCheck}
          />
          <div className={styles.filter_options__item}>
            <div className={styles.filter_options__title}>Reminders:</div>
            <select disabled="disabled">
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );

}
