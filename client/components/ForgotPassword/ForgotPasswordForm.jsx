import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Form, Field, LoginInput } from '../library';
import styles from './reskin-styles.scss';
import { emailValidate } from '../library/Form/validate';

export default function ForgotPasswordForm({ onSubmit, handleBackToSignIn, isFalseEmail }) {
  const [validEmail, setValidEmail] = useState(false);

  const isValidEmail = (email) => {
    if (emailValidate(email) === 'Please enter a valid email address') setValidEmail(false);
    else setValidEmail(true);
  };

  return (
    <Form form="forgotPassword" onSubmit={onSubmit} ignoreSaveButton>
      <Field
        name="email"
        validate={[emailValidate]}
        component={(props) => (
          <>
            <LoginInput
              label="Email Address"
              type="input"
              name="email"
              placeholder="Email Address"
              className={styles.input}
              ariaLabel="Email Address Input"
              value={props.input.value}
              error={props.meta.error}
              submitFailed={props.meta.submitFailed}
              onChange={(target) => {
                props.input.onChange(target.target.value);
                isValidEmail(target.target.value);
              }}
            />
            {isFalseEmail && (
              <p className={styles.errorMessage}>Please enter a valid email address</p>
            )}
          </>
        )}
      />
      <div className={styles.buttonContainer}>
        <Button
          tabIndex={0}
          role="button"
          border="blue"
          onClick={handleBackToSignIn}
          className={styles.button}
        >
          Return to Sign In
        </Button>
        <Button type="submit" className={styles.button} disabled={!validEmail}>
          Send Recovery Link
        </Button>
      </div>
    </Form>
  );
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool,
  }).isRequired,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  handleBackToSignIn: PropTypes.func.isRequired,
  isFalseEmail: PropTypes.bool.isRequired,
};
