
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, FormSection } from '../../../../library';
import styles from '../styles.scss';
import Loader from '../../../../Loader';
import FetchFollowUpTypes from '../../../../GraphQL/PatientFollowUps/fetchFollowUpTypes';

const booleanOptions = [
  {
    label: 'Any',
    value: 'null',
  },
  {
    label: 'Not Completed',
    value: 'false',
  },
  {
    label: 'Completed',
    value: 'true',
  },
];

const FollowUps = ({ theme, timezone, accountUsers }) => (
  <div className={styles.formContainer}>
    <FormSection name="patientFollowUps">
      <div className={styles.formHeader}>Due Date</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DayPickerWithHelpers"
          timezone={timezone}
          name="0"
          theme={theme}
          label="Date"
        />
        <span className={styles.formContainer_middleText}> to </span>
        <Field
          component="DayPickerWithHelpers"
          timezone={timezone}
          name="1"
          theme={theme}
          label="Date"
        />
      </div>

      <div className={styles.formHeader}>Created By</div>
      <div className={styles.formContainer_row}>
        <Field component="DropdownSelect" name="2" options={accountUsers} theme={theme} />
      </div>

      <div className={styles.formHeader}>Assigned To</div>
      <div className={styles.formContainer_row}>
        <Field component="DropdownSelect" name="3" options={accountUsers} theme={theme} />
      </div>

      <div className={styles.formHeader}>Reason</div>
      <FetchFollowUpTypes>
        {({ loading, error, data: { patientFollowUpTypes } }) => {
          if (loading) return <Loader isLoaded={loading} />;
          if (error) return `Error!: ${error}`;
          return (
            <Field
              component="DropdownSelect"
              name="4"
              options={patientFollowUpTypes}
              theme={theme}
            />
          );
        }}
      </FetchFollowUpTypes>
      <div className={styles.formHeader}>Status</div>
      <div className={styles.formContainer_row}>
        <Field component="DropdownSelect" name="5" options={booleanOptions} theme={theme} />
      </div>
    </FormSection>
  </div>
);

FollowUps.propTypes = {
  theme: PropTypes.objectOf(PropTypes.string),
  timezone: PropTypes.string.isRequired,
  accountUsers: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

FollowUps.defaultProps = {
  theme: {
    filled: styles.filledLabelStyle,
    label: styles.dateLabelStyle,
    group: styles.groupInputStyle,
  },
};

const mapStateToProps = ({ entities }) => {
  const accountUsers = entities
    .getIn(['users', 'models'])
    .toArray()
    .filter(({ username }) => !username.includes('sync+'))
    .map(({ id, firstName, lastName }) => ({
      value: id,
      label: `${firstName} ${lastName}`,
    }));

  return {
    accountUsers,
  };
};

export default connect(mapStateToProps)(FollowUps);
