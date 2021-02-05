
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

const FilterTags = ({ patientTable, removeTag }) => {
  /* eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }] */
  const { limit, page, order, segment, ...filters } = patientTable.get('filters').toJS();
  return (
    <div className={styles.tagsContainer}>
      {Object.keys(filters || {}).map(filter => (
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
};

FilterTags.propTypes = {
  patientTable: PropTypes.instanceOf(Map),
  removeTag: PropTypes.func.isRequired,
};

FilterTags.defaultProps = {
  patientTable: null,
};

function mapStateToProps({ patientTable }) {
  return { patientTable };
}

export default connect(mapStateToProps)(FilterTags);
