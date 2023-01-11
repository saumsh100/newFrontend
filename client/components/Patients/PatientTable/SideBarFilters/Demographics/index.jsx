import React, { useEffect } from 'react';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Field, FormSection } from '../../../../library';
import TextField from '../FilterForm/Fields/TextField';
import { leftTrim, notNegative, parseNum } from '../../../../library/Form/validate';
import styles from '../styles.scss';

const optionsGender = [{ value: 'Male' }, { value: 'Female' }];
const optionsStatus = [{ value: 'Active' }, { value: 'Inactive' }];

const theme = {
  filled: styles.filledLabelStyle,
  group: styles.groupInputStyle2,
};

const DemographicsForm = (props) => {
  const { formName, filterActiveSegmentLabel } = props;

  useEffect(() => {
    if (
      (formName === 'demographics' && filterActiveSegmentLabel === 'Follow Ups') ||
      filterActiveSegmentLabel === 'My Follow Ups (past 30 days)'
    ) {
      props.change(formName, 'status', '');
    }
  }, [filterActiveSegmentLabel, formName,]);

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}> Search By First Name</div>
      <TextField name="firstName" data-test-id="search_firstName" normalize={leftTrim} />
      <div className={styles.formHeader}> Search By Last Name</div>
      <TextField name="lastName" data-test-id="search_lastName" normalize={leftTrim} />
      <div className={styles.formHeader}> Age</div>
      <FormSection name="age" className={styles.formContainer_row}>
        <Field
          name="0"
          type="number"
          validate={[notNegative]}
          normalize={parseNum}
          data-test-id="ageInput_0"
          label="Years"
          theme={theme}
        />
        <span className={styles.formContainer_middleText}> to </span>
        <Field
          name="1"
          type="number"
          validate={[notNegative]}
          normalize={parseNum}
          data-test-id="ageInput_1"
          label="Years"
          theme={theme}
        />
      </FormSection>
      <div className={styles.formHeader}> Gender</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DropdownSelect"
          name="gender"
          options={optionsGender}
          className={styles.ddSelect}
          label="All"
          theme={theme}
          data-test-id="genderInput"
        />
      </div>
      <div className={styles.formHeader}> Location</div>
      <TextField name="city" normalize={leftTrim} />
      <div className={styles.formHeader}> Status</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DropdownSelect"
          name="status"
          options={optionsStatus}
          className={styles.ddSelect}
          label="All"
          theme={theme}
        />
      </div>
    </div>
  );
};

DemographicsForm.propTypes = {
  formName: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired,
  filterActiveSegmentLabel: PropTypes.string.isRequired,
};

const mapStateToProps = ({ patientTable, featureFlags }) => {
  const flags = featureFlags.get('flags').toJS();
  const filterActiveSegmentLabel = patientTable?.get('filterActiveSegmentLabel');

  return {
    flags,
    filterActiveSegmentLabel,
    patientTable,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      change,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DemographicsForm);
