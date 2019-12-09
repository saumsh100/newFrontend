
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '../../../../library';

import styles from '../styles.scss';

const sortAlphabetical = (a, b) => {
  if (a.name && a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name && a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
};

export default function FilterEntities(props) {
  const {
    display,
    label,
    filterKey,
    allChecked,
    entities,
    selectedFilterItem,
    handleAllCheck,
    handleEntityCheck,
  } = props;

  let showAllCheck = '';
  if (entities.length) {
    showAllCheck = (
      <div className={styles.filter_options__checkLabel}>
        <Checkbox checked={allChecked} onChange={() => handleAllCheck(filterKey)} />
        <span className={styles.filter_options__checkLabel__all}>All</span>
      </div>
    );
  }

  const sortedEntities = entities.sort(sortAlphabetical);

  return (
    <div className={styles.fillContainer}>
      <div className={styles.filter_options__title}>{label}</div>
      <div className={styles.filter_options__item}>
        {showAllCheck}
        {sortedEntities.toArray().map((entity, index) => {
          if (!entity) {
            return null;
          }

          const checked = selectedFilterItem.indexOf(entity.get('id')) > -1;
          return (
            <div key={index} className={styles.filter_options__checkLabelContainer}>
              <Checkbox
                key={entity.get(display)}
                checked={checked}
                onChange={() => handleEntityCheck(checked, entity.get('id'), filterKey)}
              />
              <div
                className={styles.filter_options__label}
                onClick={() => handleEntityCheck(checked, entity.get('id'), filterKey)}
              >
                {entity.get(display)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

FilterEntities.propTypes = {
  display: PropTypes.string,
  label: PropTypes.string,
  filterKey: PropTypes.string,
  allChecked: PropTypes.bool,
  entities: PropTypes.array,
  selectedFilterItem: PropTypes.array,
  handleAllCheck: PropTypes.func,
  handleEntityCheck: PropTypes.func,
};
