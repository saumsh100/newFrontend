
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { capitalize } from '@carecru/isomorphic';
import { Icon } from '../../../../library';
import styles from './styles.scss';

const filterNameMap = {
  recallCommunicationPreference: 'Recalls',
  reminderCommunicationPreference: 'Reminders',
  reviewCommunicationPreference: 'Reviews',
  emailCommunicationPreference: 'Email',
  smsCommunicationPreference: 'SMS',
  phoneCommunicationPreference: 'Phone',
  patientFollowUps: 'Follow Ups',
};

function FilterTags({ filters, removeTag }) {
  return (
    <div className={styles.tagsContainer}>
      {Object.keys(filters).map(filter => (
        <div key={`filterTag_${filter}`} className={styles.tagBody}>
          <div className={styles.tagText}>
            {filter in filterNameMap
              ? filterNameMap[filter]
              : capitalize(filter.replace(/([a-z])([A-Z])/g, '$1 $2'))}
          </div>
          <div
            className={styles.closeIcon}
            role="button"
            tabIndex="-1"
            onKeyDown={({ keyCode }) => keyCode === 13 && removeTag(filter)}
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
  /* eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }] */
  const { limit, page, order, segment, ...filters } = patientTable.get('filters').toJS();
  return { filters };
}

export default connect(mapStateToProps)(FilterTags);
