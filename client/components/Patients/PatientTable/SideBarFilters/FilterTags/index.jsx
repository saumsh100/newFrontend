
import React, { PropTypes } from 'react';
import { Icon } from '../../../../library';
import styles from './styles.scss';

export default function FilterTags(props) {
  const { filterTags, removeTag } = props;

  return (
    <div className={styles.tagsContainer}>
      {filterTags.map((filter, index) => (
        <div key={`filterTag_${index}`} className={styles.tagBody}>
          <div className={styles.tagText}>{filter.tag}</div>
          <div
            className={styles.closeIcon}
            onClick={(e) => {
                e.stopPropagation();
                removeTag(filter);
              }}
          >
            <Icon icon="times" />
          </div>
        </div>
        ))}
    </div>
  );
}

FilterTags.propTypes = {
  filterTags: PropTypes.object.isRequired,
  removeTag: PropTypes.func.isRequired,
};
