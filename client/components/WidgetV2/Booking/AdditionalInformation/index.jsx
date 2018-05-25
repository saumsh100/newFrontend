
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import DataSlot from '../../../library/DataSlot';
import { SortByFirstName } from '../../../library/util/SortEntities';
import { Button, Field, Form, Loading, Link } from '../../../library';
import { fetchFamilyPatients } from '../../../../thunks/familyPatients';
import SuggestionSelect from '../../../library/DropdownSuggestion/SuggestionSelect';
import styles from './styles.scss';

/**
 * Find the first option that matches the passed string.
 *
 * @param {array} data
 * @param {string} value
 */
const validateField = (data, value) => data.find(item => item.value === value);

class AdditionalInformation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };

    /**
     * Fetch the family patients,
     * after fetching set the loading as false.
     */
    props.fetchFamilyPatients().then(() => this.setState({ isLoading: false }));
  }

  render() {
    const { familyPatients, userId, familyPatientUser } = this.props;

    if (this.state.isLoading) {
      return <Loading />;
    }

    const patients =
      familyPatients &&
      familyPatients.sort(SortByFirstName).map(patient => ({
        value: patient.id,
        label: `${patient.firstName} ${patient.lastName}`,
      }));

    const patientList = (props, currentValue, scrollIndex, close, callback) => (
      <div tabIndex="-1" className={styles.dropDownList} ref={callback}>
        {props.options.map((option, i) => (
          <DataSlot
            key={i}
            {...props}
            selected={currentValue === option.value}
            option={option}
            theme={{ slotButton: styles.slotButton }}
          >
            <Button
              className={styles.labelPatient}
              onClick={(e) => {
                e.preventDefault();
                props.onChange(option.value);
                scrollIndex = i;
                close();
              }}
            >
              {option.value === userId ? `${option.label} (Me)` : option.label}
            </Button>
            <Link to={`../patient/edit/${option.value}`} className={styles.editLink} tabIndex="-1">
              <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 9.5V12h2.5l7.372-7.372-2.5-2.5L0 9.5zm11.805-6.805c.26-.26.26-.68 0-.94l-1.56-1.56a.664.664 0 0 0-.94 0l-1.22 1.22 2.5 2.5 1.22-1.22z" />
              </svg>
            </Link>
          </DataSlot>
        ))}
        <Link to="../patient/add" className={styles.addNewPatient}>
          Someone Else
        </Link>
      </div>
    );

    return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <h3 className={styles.title}>Additional Information</h3>
            <p className={styles.subtitle}>
              Add family members and leave any necessary notes for the practice.
            </p>
            <Form
              form="additionalInformation"
              initialValues={{ patientUserId: familyPatientUser || userId }}
              ignoreSaveButton
              onSubmit={values => console.log(values)}
            >
              <div className={styles.group}>
                <Field
                  name="patientUserId"
                  label="Who will be seeing the dentist?"
                  component={SuggestionSelect}
                  required
                  theme={{
                    wrapper: styles.wrapper,
                    toggleDiv: styles.input,
                    caretIconWrapper: styles.caretIconWrapper,
                    erroredLabelFilled: styles.erroredLabelFilled,
                    input: styles.input,
                    filled: styles.filled,
                    label: styles.label,
                    error: styles.error,
                    errorIcon: styles.errorIcon,
                    errorToggleDiv: styles.erroredInput,
                    bar: styles.bar,
                    erroredLabel: styles.erroredLabel,
                  }}
                  renderValue={value =>
                    (validateField(patients, value) && validateField(patients, value).label) || ''
                  }
                  renderList={patientList}
                  options={patients}
                  data-test-id="patientUserId"
                />
              </div>
              <Field
                component="TextArea"
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.textarea,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                label="Notes"
                name="notes"
              />
              <Button type="submit" className={styles.actionButton}>
                Next
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchFamilyPatients,
    },
    dispatch
  );
}

function mapStateToProps({ auth, availabilities }) {
  return {
    userId: auth.get('patientUser').get('id'),
    familyPatients: auth.get('familyPatients'),
    familyPatientUser: availabilities.get('familyPatientUser'),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdditionalInformation));

AdditionalInformation.propTypes = {
  fetchFamilyPatients: PropTypes.func,
  familyPatientUser: PropTypes.string,
  familyPatients: PropTypes.arrayOf(
    PropTypes.shape({
      birthDate: PropTypes.string,
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      gender: PropTypes.string,
      id: PropTypes.string,
      isEmailConfirmed: PropTypes.bool,
      isPhoneNumberConfirmed: PropTypes.bool,
      patientUserFamilyId: PropTypes.string,
      phoneNumber: PropTypes.string,
    })
  ),
  userId: PropTypes.string,
};
