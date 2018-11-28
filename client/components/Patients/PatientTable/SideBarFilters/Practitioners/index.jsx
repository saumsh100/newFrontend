
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field } from '../../../../library';
import { SortByFirstName } from '../../../../library/util/SortEntities';
import styles from '../styles.scss';

function Practitioners({ practitioners, theme }) {
  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>Name</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DropdownSelect"
          name="practitioner"
          options={practitioners}
          theme={theme}
          label="Doctor / Hygienist"
        />
      </div>
    </div>
  );
}

Practitioners.propTypes = {
  practitioners: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  theme: PropTypes.objectOf(PropTypes.string),
};

Practitioners.defaultProps = {
  practitioners: [],
  theme: {
    group: styles.groupInputStyle2,
    filled: styles.filledLabelStyle,
  },
};

function mapStateToProps({ entities }) {
  const toLabelValue = p => ({
    label: p.getPrettyName(),
    value: p.id,
  });

  const practitioners = entities
    .getIn(['practitioners', 'models'])
    .sort(SortByFirstName)
    .map(toLabelValue)
    .toArray();
  return { practitioners };
}

export default connect(mapStateToProps)(Practitioners);
