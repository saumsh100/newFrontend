
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { Button, Form, Grid, Row, Col, Field } from '../../library';
import { setFamilyPatientUser } from '../../../actions/availabilities';
import {
  asyncValidatePatient,
  normalizeBirthdate,
  validateBirthdate,
} from '../../library/Form/validate';
import styles from './styles.scss';

const genderOptions = [{ value: 'Male' }, { value: 'Female' }];

class AddPatient extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Send a post request in order to
   * add a patientUser to a patientUserFamily,
   * after that push back to the review page.
   *
   * @param {array} values
   */
  handleSubmit(values) {
    const { user } = this.props;
    return axios
      .post(`/families/${user.patientUserFamilyId}/patients`, values)
      .then(response => this.props.setFamilyPatientUser(response.data.id))
      .then(() => this.props.history.goBack({ pathname: '../book/review' }));
  }

  render() {
    return (
      <div className={styles.main}>
        <Form
          ignoreSaveButton
          form="addFamilyPatient"
          onSubmit={this.handleSubmit}
          asyncValidate={asyncValidatePatient}
          asyncBlurFields={['email', 'phoneNumber']}
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
                  name="birthDate"
                  label="Birth Date (MM/DD/YYYY)"
                />
              </Col>
            </Row>
          </Grid>
          <Field name="phoneNumber" label="Mobile Number" type="tel" />
          <Field label="Email" name="email" type="email" />
          <Button type="submit">Create Patient</Button>
        </Form>
      </div>
    );
  }
}

AddPatient.propTypes = {
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setFamilyPatientUser,
    },
    dispatch
  );
}

function mapStateToProps({ auth }) {
  return {
    user: auth.get('patientUser'),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPatient));
