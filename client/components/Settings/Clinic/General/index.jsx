
import React, {PropTypes, Component} from 'react';
import { SubmissionError } from 'redux-form';
import GeneralForm from './GeneralForm';


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

export default function General(props) {
  return (
    <div>
      {props.accounts.map((account) => {
        return( <GeneralForm onSubmit={submit} accountInfo={account} />);
      })}
    </div>
  );
}


