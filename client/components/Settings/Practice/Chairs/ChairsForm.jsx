
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Form, Field } from '../../../library/index';
import styles from './styles.scss';

const chairThatWasChanged = (values, formValues, initialValues) => {
  const ids = Object.keys(values);
  let filterIds = [];
  if (!Object.keys(formValues).length) {
    filterIds = ids.filter(id => initialValues[id] !== values[id]);
  } else {
    filterIds = ids.filter(id => formValues[id] !== values[id]);
  }

  return filterIds;
};

export default function ChairsForm(props) {
  const {
    chairs, handleSubmit, initialValues, formValues,
  } = props;

  if (!chairs) {
    return null;
  }

  return (
    <Form
      form="chairsForm"
      onChange={(values) => {
        handleSubmit(
          chairThatWasChanged(values, formValues, initialValues),
          values,
        );
      }}
      enableReinitialize
      keepDirtyOnReinitialize
      destroyOnUnmount={false}
      alignSave="left"
      initialValues={initialValues}
      ignoreSaveButton
      data-test-id="chairsForm"
    >
      <div className={styles.formContainer}>
        {chairs.map((chair, index) => (
          <div className={styles.chairContainer}>
            <div>
              <div className={styles.chairContainer_name}>
                {chair.get('name')}
              </div>
              <div className={styles.chairContainer_id}>{chair.get('id')}</div>
            </div>
            <div
              className={styles.chairContainer_toggle}
              data-test-id={`chair_${index}`}
            >
              <Field component="Toggle" name={chair.get('id')} />
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
}

ChairsForm.propTypes = {
  chairs: PropTypes.arrayOf(PropTypes.shape({})),
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({}),
  formValues: PropTypes.shape({}),
};
