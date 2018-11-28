
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import capitalize from '../../../../../../iso/helpers/string/capitalize';
import { Icon } from '../../../../library';
import styles from './styles.scss';

function FilterTags({ filters, removeTag }) {
  return (
    <div className={styles.tagsContainer}>
      {Object.keys(filters).map(filter => (
        <div key={`filterTag_${filter}`} className={styles.tagBody}>
          <div className={styles.tagText}>
            {capitalize(filter.replace(/([a-z])([A-Z])/g, '$1 $2'))}
          </div>
          <div
            className={styles.closeIcon}
            role="button"
            tabIndex="-1"
            onKeyDown={({ keyCode }) => keyCode === '13' && removeTag(filter)}
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
  filters: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])),
  removeTag: PropTypes.func.isRequired,
};

FilterTags.defaultProps = { filters: {} };

function mapStateToProps({ patientTable }) {
  const { limit, page, order, segment, ...filters } = patientTable.get('filters').toJS();
  return { filters };
}

export default connect(mapStateToProps)(FilterTags);
