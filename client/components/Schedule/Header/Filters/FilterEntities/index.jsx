import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '../../../../library';

import styles from '../reskin-styles.scss';

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
        {sortedEntities.toArray().map((entity) => {
          if (!entity) {
            return null;
          }
          const entityId = entity.get('id');
          const checked = selectedFilterItem.indexOf(entityId) > -1;
          return (
            <div key={entityId} className={styles.filter_options__checkLabelContainer}>
              <Checkbox
                key={entity.get(display)}
                checked={checked}
                onChange={() => handleEntityCheck(checked, entityId, filterKey)}
              />
              <button
                type="button"
                className={styles.filter_options__label}
                onClick={() => handleEntityCheck(checked, entityId, filterKey)}
              >
                {entity.get(display)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

FilterEntities.propTypes = {
  display: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  filterKey: PropTypes.string.isRequired,
  allChecked: PropTypes.bool.isRequired,
  entities: PropTypes.arrayOf.isRequired,
  selectedFilterItem: PropTypes.arrayOf.isRequired,
  handleAllCheck: PropTypes.func.isRequired,
  handleEntityCheck: PropTypes.func.isRequired,
};
