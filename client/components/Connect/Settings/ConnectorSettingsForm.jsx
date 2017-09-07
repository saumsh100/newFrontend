
import React, { PropTypes } from 'react';
import {
  Form,
  Field,
  VButton,
} from '../../library';
import styles from './styles.scss';

const options = [
  {
    value: 'Cleardent_7',
    label: 'Cleardent 7',
  },
  {
    value: 'Cleardent_9',
    label: 'Cleardent 9',
  },
  {
    value: 'Tracker_11',
    label: 'Tracker 11',
  },
];

export default function ConnectorSettingsForm({ initialValues, onSubmit }) {
  return (
    <Form
      form="connectorSettings"
      onSubmit={onSubmit}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <Field
        name="adapterType"
        component="DropdownSelect"
        label="Practice Management Software"
        options={options}
        required
      />
      <VButton>
        Next
      </VButton>
    </Form>
  );
}

ConnectorSettingsForm.propTypes = {

};
