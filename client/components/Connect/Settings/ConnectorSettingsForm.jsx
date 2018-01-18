
import React, { PropTypes } from 'react';
import {
  Form,
  Field,
  VButton,
} from '../../library';
import styles from './form.scss';

const options = [
  {
    value: 'CLEARDENT_V7',
    label: 'Cleardent 7',
  },
  {
    value: 'CLEARDENT_V9',
    label: 'Cleardent 9',
  },
  {
    value: 'TRACKER_V11',
    label: 'Tracker 11',
  },
  {
    value: 'DENTRIX_V61',
    label: 'Dentrix G6.1',
  },
  {
    value: 'OPENDENTAL_V17',
    label: 'OpenDental 17',
  },
];

export default function ConnectorSettingsForm({ initialValues, onSubmit }) {
  return (
    <Form
      form="connectorSettings"
      onSubmit={onSubmit}
      initialValues={initialValues}
      ignoreSaveButton
      className={styles.form}
    >
      <Field
        name="adapterType"
        component="DropdownSelect"
        label="Practice Management Software"
        options={options}
        required
      />
      <VButton
        className={styles.nextButton}
        color="dark"
        iconRight="angle-right"
        title="Next"
      />
    </Form>
  );
}

ConnectorSettingsForm.propTypes = {

};
