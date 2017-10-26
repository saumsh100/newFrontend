import React, { PropTypes } from 'react';
import { Icon } from '../../../../library'
import styles from './styles.scss';

export default function FilterTags(props) {
  const {
    filters,
  } = props;

  if (!filters.length) {
    return null;
  }

  return (
    <div className={styles.filterTags}>
      {filters.map((filterObj) => {
        return (
          <div className={styles.tags}>
            <div>{filterObj.type}</div>
            <div className={styles.tags_icon}>
              <Icon
                icon="times"
                size="1.5"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
