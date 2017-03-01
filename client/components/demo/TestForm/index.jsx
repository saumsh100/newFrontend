
import React, { PropTypes } from 'react';
import { SubmissionError } from 'redux-form';
import { Form, Field, Button } from '../../library';

const containsLetter = (letter) => (value) => {
  return (value && value.includes(letter)) ? `Cannot contain the letter ${letter}` : undefined;
};

const equalNames = ({ firstName, lastName }) => {
  const errors = {};
  if (firstName && lastName && (firstName !== lastName)) {
    errors.lastName = 'First and last names do not match!';
  }
  
  return errors;
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function submit(values) {
  return sleep(1000) // simulate server latency
    .then(() => {
      if (![ 'john', 'paul', 'george', 'ringo' ].includes(values.firstName)) {
        throw new SubmissionError({ firstName: 'First name is wrong', _error: 'General Error' });
      } else if (values.middleName !== 'TestForm') {
        throw new SubmissionError({ middleName: 'Middle name is incorrect', _error: 'General Error' });
      } else {
        window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
      }
    });
}

export default function TestForm({ patient, onSubmit }) {
  const initialValues = {
    firstName: patient.firstName,
    middleName: patient.middleName,
    lastName: patient.lastName,
    city: 'Vancouver',
  };

  return (
    <Form form="testForm" onSubmit={onSubmit} validate={equalNames} initialValues={initialValues}>
      <Field
        required
        name="firstName"
        label="First Name"
      />
      <Field
        name="middleName"
        label="Middle Name"
        validate={[ containsLetter('a') ]}
      />
      <Field
        required
        name="lastName"
        label="Last Name"
        validate={[ containsLetter('c') ]}
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
