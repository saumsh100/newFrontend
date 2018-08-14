
import PropTypes from 'prop-types';
import React from 'react';
import { SubmissionError, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Field, Button } from '../../library';

const containsLetter = letter => value => (value && value.includes(letter)
  ? `Cannot contain the letter ${letter}`
  : undefined);

const equalNames = ({ firstName, lastName }) => {
  const errors = {};
  if (firstName && lastName && firstName !== lastName) {
    errors.lastName = 'First and last names do not match!';
  }

  return errors;
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function submit(values) {
  return sleep(1000) // simulate server latency
    .then(() => {
      if (!['john', 'paul', 'george', 'ringo'].includes(values.firstName)) {
        throw new SubmissionError({
          firstName: 'First name is wrong',
          _error: 'General Error',
        });
      } else if (values.middleName !== 'TestForm') {
        throw new SubmissionError({
          middleName: 'Middle name is incorrect',
          _error: 'General Error',
        });
      } else {
        window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
      }
    });
}

function TestForm({ patient, onSubmit, change }) {
  const initialValues = {
    firstName: patient.firstName,
    middleName: patient.middleName,
    lastName: patient.lastName,
    city: 'Vancouver',
  };

  return (
    <Form
      form="testForm"
      onSubmit={onSubmit}
      validate={equalNames}
      initialValues={initialValues}
    >
      <Field
        required
        name="firstName"
        label="First Name"
        onChange={(event, newValue, previousValue) => {
          if (newValue === 'cat') {
            change('testForm', 'middleName', 'DOG');
          }
        }}
      />
      <Field
        name="middleName"
        label="Middle Name"
        validate={[containsLetter('a')]}
      />
      <Field
        required
        name="lastName"
        label="Last Name"
        validate={[containsLetter('c')]}
      />
      <Field
        required
        component="DropdownSelect"
        name="city"
        label="City"
        options={[
          { value: 'Edmonton' },
          { value: 'Calgary' },
          { value: 'Vancouver' },
        ]}
      />
    </Form>
  );
}

TestForm.propTypes = {
  patient: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      change,
    },
    dispatch,
  );
}

export default connect(
  null,
  mapDispatchToProps,
)(TestForm);
