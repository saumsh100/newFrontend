
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library/index';
import AccountShape from '../../../library/PropTypeShapes/accountShape';
import styles from './styles.scss';

export default function ChairSchedulingForm({ handleSubmit, activeAccount }) {
  const initialValues = { isChairSchedulingEnabled: activeAccount.get('isChairSchedulingEnabled') };

  return (
    <Form
      form="chairSchedulingForm"
      onSubmit={handleSubmit}
      initialValues={initialValues}
      data-test-id="chairSchedulingForm"
      alignSave="left"
    >
      <div className={styles.chairSchedulingToggleWrapper}>
        <Field
          name="isChairSchedulingEnabled"
          label="Is Donna's Chair Scheduling enabled?"
          component="Toggle"
          data-test-id="isChairSchedulingEnabled"
        />
      </div>
    </Form>
  );
}

ChairSchedulingForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  activeAccount: PropTypes.shape(AccountShape).isRequired,
};
