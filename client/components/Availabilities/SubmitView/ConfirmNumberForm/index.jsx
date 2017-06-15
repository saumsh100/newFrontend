
import React, { PropTypes } from 'react';
import { VButton, Form, Field } from '../../../library';
import { numDigitsValidate } from '../../../library/Form/validate';
import { maxDigits } from '../../../library/Form/normalize';
import styles from './styles.scss';

const MAX_DIGITS = 4;

export default function ConfirmNumberForm({ onSubmit }) {
  return (
    <Form
      form="confirmNumberForm"
      onSubmit={onSubmit}
      ignoreSaveButton
    >
      <Field
        required
        name="confirmCode"
        label="Confirmation Code"
        validate={[numDigitsValidate(MAX_DIGITS)]}
        normalize={maxDigits(MAX_DIGITS)}
      />
      <VButton
        type="submit"
        className={styles.signup__footer_btn}
      >
        Book This Appointment
      </VButton>
    </Form>
  );
}

ConfirmNumberForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
