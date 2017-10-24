import React, { PropTypes } from 'react';
import { Icon } from '../../../library'
import styles from './styles.scss';

export default function FilterTags(props) {
  const {
    smartFilters,
    removeSmartFilter
  } = props;

  if (!smartFilters.length) {
    return null;
  }

  const colors = ['#347283', '#FFC45A', '#2CC4A7'];

  return (
    <div className={styles.filterTags}>
      {smartFilters.map((filterObj, index) => {
        const bgStyle = {
          background: colors[index],
        };

        return filterObj.data.map((tag) => {
          return (
            <div className={styles.tags} style={bgStyle}>
              <div>{`${filterObj.id} : ${tag}`}</div>
              <div className={styles.tags_icon}>
                <Icon
                  icon="times"
                  size="1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSmartFilter({
                      id: filterObj.id,
                      tag,
                    });
                  }}
                />
              </div>
            </div>
          );
        })
      })}
    </div>
  );
}
