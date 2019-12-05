
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, Field } from '../library';
import styles from './styles.scss';

export default function Login({ onSubmit, className }) {
  return (
    <Form form="login" onSubmit={onSubmit} ignoreSaveButton className={className}>
      <Field type="email" name="email" label="Email" required />
      <Field type="password" name="password" label="Password" required />
      <Button type="submit" className={styles.signInSubmitButton}>
        Sign In
      </Button>
    </Form>
  );
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Login.defaultProps = {
  className: '',
};
