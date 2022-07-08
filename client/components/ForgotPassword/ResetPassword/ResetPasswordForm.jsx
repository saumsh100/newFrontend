/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { LoginInput, StandardButton } from '../../library';
import { passwordStrength } from '../../library/Form/validate';
import styles from '../reskin-styles.scss';

function ResetPasswordForm({ onSubmit }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({ hasError: false, message: '', type: null });
  const [initial, setInitial] = useState(true);

  const [validateSchema, setValidateSchema] = useState({
    minLength: false,
    strongPassword: false,
    matchPassword: false,
  });

  const createError = (message, type) => {
    setError({ ...error, hasError: true, message, type });
  };

  const clearError = () => {
    if (Object.values(validateSchema).every((item) => item === true))
      setError({ ...error, hasError: false, message: '', type: null });
  };

  const handleMatchInputs = () => {
    if (password !== confirmPassword) {
      createError('Passwords do not match', 'match');
      return false;
    }
    clearError();
    return true;
  };

  const handlePasswordMinLength = () => {
    if (password.length < 6) {
      createError('Password length must be at least 6 characters', 'minLength');
      return false;
    }
    clearError();
    return true;
  };

  const handlePasswordStrength = () => {
    const message = passwordStrength(password);
    if (message) {
      createError(message, 'strongPassword');
      return false;
    }
    clearError();
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !(validateSchema.matchPassword && validateSchema.strongPassword && validateSchema.minLength)
    ) {
      return;
    }
    onSubmit({ password, confirmPassword });
  };

  const passwordConditions = () => {
    return (
      (error.type === 'minLength' || error.type === 'strongPassword') &&
      !(validateSchema.matchPassword && validateSchema.strongPassword && validateSchema.minLength)
    );
  };
  const confirmPasswordConditions = () => {
    return (
      error.type === 'match' &&
      !(validateSchema.matchPassword && validateSchema.strongPassword && validateSchema.minLength)
    );
  };

  useEffect(() => {
    if (password.length > 0 || confirmPassword.length > 0) {
      setInitial(false);
    } else {
      setInitial(true);
    }

    if (!initial) {
      setValidateSchema({
        matchPassword: handleMatchInputs(),
        strongPassword: handlePasswordStrength(),
        minLength: handlePasswordMinLength(),
      });
    }
  }, [password, confirmPassword]);

  return (
    <form form="resetPassword" ignoreSaveButton onSubmit={handleSubmit}>
      <LoginInput
        label="New Password"
        type="password"
        name="password"
        placeholder="New Password"
        className={styles.input}
        ariaLabel="Email Address Input"
        value={password}
        submitFailed={error.hasError && passwordConditions()}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      {error.hasError && passwordConditions() && (
        <p className={styles.noMarginErrorMessage}>{error.message}</p>
      )}
      <LoginInput
        label="Re-Enter Password"
        type="password"
        name="confirmPassword"
        placeholder="Re-Enter Password"
        className={styles.input}
        ariaLabel="Re-Enter Password Input"
        value={confirmPassword}
        submitFailed={error.hasError && confirmPasswordConditions()}
        onChange={(event) => {
          setConfirmPassword(event.target.value);
          handleMatchInputs();
        }}
      />
      {error.hasError && confirmPasswordConditions() && (
        <p className={styles.noMarginErrorMessage}>{error.message}</p>
      )}
      <div className={styles.submitButtonContainer}>
        <StandardButton
          type="submit"
          variant="primary"
          disabled={
            !(
              validateSchema.matchPassword &&
              validateSchema.strongPassword &&
              validateSchema.minLength
            )
          }
          className={classNames(styles.submitButtonContainer_button)}
        >
          Reset Password
        </StandardButton>
      </div>
    </form>
  );
}

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ResetPasswordForm;
