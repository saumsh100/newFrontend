
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Query } from 'react-apollo';
import MultiSelect from '../../../library/MultiSelect';
import { familyDataSelector } from '../../Shared/helpers';
import SentRecallList from './SentRecallList';
import SentRecallSelector from './SentRecallSelector';
import { Form, Field } from '../../../library';
import patientInfoQuery from '../PatientInfo_Query';
import styles from './styles.scss';

const contactOptions = [
  {
    label: 'Phone',
    value: 'phone',
  },
  {
    label: 'SMS',
    value: 'sms',
  },
  {
    label: 'Email',
    value: 'email',
  },
];

const ErrorMessage = props => <div className={styles.errorMessage}>{props.msg}</div>;

ErrorMessage.propTypes = {
  msg: PropTypes.string.isRequired,
};

class LogRecallForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPatientFamily: [props.patientId],
      patientFamilyError: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.PatientFamilyField = this.PatientFamilyField.bind(this);
  }

  handleSubmit(values) {
    const res = {
      ...values,
      patientFamily: this.state.selectedPatientFamily,
    };

    if (res.patientFamily.length > 0) {
      this.props.onSubmit(res);
    } else {
      // error notification
      this.setState({
        patientFamilyError: true,
      });
    }
  }

  // multi-select patients
  PatientFamilyField({ error, loading, data }, patientId) {
    if (loading) return null;

    if (error) {
      return console.log('error fetching patinentInfoQuery');
    }

    const { family, familyLength } = familyDataSelector(data.accountViewer);

    if (familyLength <= 1 || this.props.isUpdate) {
      return null;
    }

    const patientFamily = family.members.edges.map(({ node: { firstName, lastName, ccId } }) => ({
      label: `${firstName} ${lastName}`,
      value: ccId,
    }));

    return (
      <MultiSelect
        initialSelectedItem={[patientId]}
        onChange={value =>
          this.setState({
            selectedPatientFamily: value,
            patientFamilyError: false,
          })
        }
      >
        {({
          getToggleButtonProps,
          handleSelection,
          isOpen,
          selectedItems,
          getItemProps,
          highlightedIndex,
        }) => (
          <div className={styles.selectWrapper}>
            <span
              className={
                isOpen ? classNames(styles.fieldLabel, styles.fieldLabelActive) : styles.fieldLabel
              }
            >
              Patient Family
            </span>
            <SentRecallSelector
              selected={selectedItems.map(value => ({
                value,
                label: patientFamily.find(patient => patient.value === value).label,
              }))}
              placeholder="Select patient(s)"
              isOpen={isOpen}
              selectorProps={getToggleButtonProps()}
              handleSelection={handleSelection}
            />
            <SentRecallList
              showFallback
              selectedItems={selectedItems}
              isOpen={isOpen}
              options={patientFamily}
              itemProps={getItemProps}
              highlightedIndex={highlightedIndex}
            />
          </div>
        )}
      </MultiSelect>
    );
  }

  render() {
    const { initialValues, formName, className, patientId } = this.props;
    return (
      <Form
        key={formName}
        form={formName}
        onSubmit={values => this.handleSubmit(values)}
        initialValues={initialValues}
        className={className}
        data-test-id={formName}
        ignoreSaveButton
      >
        <Query query={patientInfoQuery} variables={{ patientId }}>
          {res => this.PatientFamilyField(res, patientId)}
        </Query>
        {this.state.patientFamilyError && <ErrorMessage msg="Select at least 1 patient" />}
        <Field
          disabled
          name="createdAt"
          label="Date Sent"
          date-test-id="createdAt"
          component="DayPicker"
        />
        <Field
          required
          name="primaryType"
          label="Contact Method"
          date-test-id="primaryType"
          component="DropdownSelect"
          options={contactOptions}
        />
        <Field name="note" label="Note" data-test-id="note" component="TextArea" />
      </Form>
    );
  }
}

export default LogRecallForm;

LogRecallForm.propTypes = {
  patientId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  isUpdate: PropTypes.bool.isRequired,
  className: PropTypes.string,
  initialValues: PropTypes.shape({}).isRequired,
};

LogRecallForm.defaultProps = {
  className: null,
};
