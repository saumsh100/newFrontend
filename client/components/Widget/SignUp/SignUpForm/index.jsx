
import React, { PropTypes } from 'react';
import { Button, Form, Field, Grid, Row, Col } from '../../../library';
import {
  asyncValidatePatient,
  passwordsMatch,
  passwordStrength,
  normalizeBirthdate,
  validateBirthdate,
} from '../../../library/Form/validate';
import styles from './styles.scss';

const defaultSubmitButton = (
  <Button type="submit" className={styles.signup__footer_btn}>
    Sign Up and Book
  </Button>
);

export default function SignUpForm({
  onSubmit,
  initialValues,
  className,
  submitButton = defaultSubmitButton,
}) {
  return (
    <Form
      form="userSignUpForm"
      onSubmit={onSubmit}
      className={className}
      validate={passwordsMatch}
      initialValues={initialValues}
      asyncValidate={asyncValidatePatient}
      asyncBlurFields={['email', 'phoneNumber']}
      ignoreSaveButton
    >
      <Grid>
        <Row>
          <Col xs={6} className={styles.colLeft}>
            <Field required name="firstName" label="First Name" />
          </Col>
          <Col xs={6} className={styles.colRight}>
            <Field required name="lastName" label="Last Name" />
          </Col>
        </Row>
      </Grid>
      <Field
        normalize={normalizeBirthdate}
        validate={[validateBirthdate]}
        required
        name="birthDate"
        label="Birth Date (MM/DD/YYYY)"
      />
      <Field required name="phoneNumber" label="Mobile Number" type="tel" />
      <Field required label="Email" name="email" type="email" />
      <Field
        required
        label="Password"
        name="password"
        // popover="Password must be uncommon words and no sequences. Tips: Use uncommon words or creative spelllllings"
        type="password"
        validate={[passwordStrength]}
      />
      <Field
        required
        label="Confirm Password"
        name="confirmPassword"
        type="password"
      />
      {submitButton}
    </Form>
  );
}

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};
