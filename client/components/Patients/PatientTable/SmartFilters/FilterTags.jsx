import React, { PropTypes } from 'react';
import { Icon } from '../../../library'
import styles from './styles.scss';

export default function FilterTags(props) {
  const {
    smartFilters,
    removeSmartFilter,
  } = props;

  if (!smartFilters.length) {
    return null;
  }

  return (
    <div className={styles.filterTags}>
      {smartFilters.map((filterObj) => {
        return (
          <div className={styles.tags}>
            <div>{`${filterObj.id} ${filterObj.value}`}</div>
            <div className={styles.tags_icon}>
              <Icon
                icon="times"
                size="1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSmartFilter();
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
