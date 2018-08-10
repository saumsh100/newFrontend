
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Button, Form, Grid, Row, Col, Field } from '../../library';
import {
  composeAsyncValidators,
  normalizeBirthdate,
  validateBirthdate,
  emailValidate,
} from '../../library/Form/validate';
import { normalizePhone } from '../../library/Form/normalize';
import { fetchFamilyPatients } from '../../../thunks/familyPatients';
import styles from './styles.scss';

const genderOptions = [{ value: 'Male' }, { value: 'Female' }];

class EditPatient extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Fetches the patients on the family,
   * to compare the uid on the URL with the UIDs
   * on the fetched data, if we don't match any UID,
   * redirect the user back to the Review & Book page.
   */
  componentWillMount() {
    return this.props.fetchFamilyPatients().then(() => {
      if (!this.props.patientUser) {
        this.props.history.push('../../book/review');
      }
    });
  }

  /**
   * Updates a patientUser.
   *
   * @param values
   */
  async handleSubmit(values) {
    const { user } = this.props;
    try {
      await axios.put(
        `/families/${user.patientUserFamilyId}/patients/${this.props.match.params.patientId}`,
        values,
      );
      await this.props.fetchFamilyPatients();
    } catch (err) {
      console.log('Error updating patient!', err);
    }

    return this.props.history.push({
      pathname: '../../book/review',
    });
  }

  render() {
    /**
     * Check if the passed email is not already used,
     * but first check if the email is not the same as the patient.
     *
     * @param {object} values
     */
    const asyncEmailValidation = ({ email }) => {
      const { initial } = this.props.formValues;
      if (!email || email === initial.email) {
        return;
      }
      return axios.post('/patientUsers/email', { email }).then((response) => {
        if (response.data.exists) {
          throw { email: 'There is already a user with that email' };
        }
      });
    };
    /**
     * Check if the passed phoneNumber is not already used,
     * but first check if the phoneNumber is not the same as the patient.
     *
     * @param {object} values
     */
    const asyncPhoneNumberValidation = ({ phoneNumber }) => {
      const { initial } = this.props.formValues;
      if (
        !phoneNumber ||
        phoneNumber === initial.phoneNumber ||
        phoneNumber === normalizePhone(initial.phoneNumber)
      ) {
        return;
      }
      return axios.post('/patientUsers/phoneNumber', { phoneNumber }).then((response) => {
        const { error } = response.data;
        if (error) {
          throw { phoneNumber: error };
        }
      });
    };

    const { birthDate } = this.props.patientUser;

    const initialValues = this.props.patientUser.toJS();
    initialValues.birthDate = birthDate ? moment(birthDate).format('MM/DD/YYYY') : null;

    return (
      <div className={styles.main}>
        <Form
          ignoreSaveButton
          form="editFamilyPatient"
          onSubmit={this.handleSubmit}
          initialValues={initialValues}
          asyncValidate={composeAsyncValidators([asyncEmailValidation, asyncPhoneNumberValidation])}
          asyncBlurFields={['email', 'phoneNumber', 'birthDate']}
        >
          <Grid>
            <Row>
              <Col xs={6} className={styles.colLeft}>
                <Field required name="firstName" label="First Name *" />
              </Col>
              <Col xs={6} className={styles.colRight}>
                <Field required name="lastName" label="Last Name *" />
              </Col>
            </Row>
          </Grid>
          <Grid>
            <Row>
              <Col xs={6} className={styles.colLeft}>
                <Field
                  label="Gender"
                  name="gender"
                  component="DropdownSelect"
                  options={genderOptions}
                />
              </Col>
              <Col xs={6} className={styles.colRight}>
                <Field
                  normalize={normalizeBirthdate}
                  validate={[validateBirthdate]}
                  required
                  name="birthDate"
                  label="Birth Date (MM/DD/YYYY)"
                />
              </Col>
            </Row>
          </Grid>
          <Field name="phoneNumber" label="Mobile Number" type="tel" />
          <Field label="Email" name="email" validate={[emailValidate]} />
          <div className={styles.submitButtonWrapper}>
            <Button type="submit">Update</Button>
          </div>
        </Form>
      </div>
    );
  }
}

EditPatient.propTypes = {
  fetchFamilyPatients: PropTypes.func,
  history: PropTypes.shape({
    action: PropTypes.string,
    block: PropTypes.func,
    createHref: PropTypes.func,
    go: PropTypes.func,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
    length: PropTypes.number,
    listen: PropTypes.func,
    location: PropTypes.object,
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }),
  user: PropTypes.shape({
    id: PropTypes.string,
    gender: PropTypes.any,
    email: PropTypes.string,
    birthDate: PropTypes.any,
    deletedAt: PropTypes.any,
    avatarUrl: PropTypes.any,
    lastName: PropTypes.string,
    updatedAt: PropTypes.string,
    createdAt: PropTypes.string,
    firstName: PropTypes.string,
    phoneNumber: PropTypes.string,
    isEmailConfirmed: PropTypes.bool,
    patientUserFamilyId: PropTypes.string,
    isPhoneNumberConfirmed: PropTypes.bool,
  }),
};

function mapStateToProps({ auth, form }, { match }) {
  return {
    formValues: form.editFamilyPatient,
    user: auth.get('patientUser'),
    patientUser: auth.get('familyPatients').find(patient => patient.id === match.params.patientId),
    familyPatients: auth.get('familyPatients'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchFamilyPatients,
    },
    dispatch,
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPatient));
