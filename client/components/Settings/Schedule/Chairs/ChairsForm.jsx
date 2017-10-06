import React, { PropTypes } from 'react';
import { Form, Field } from '../../../library';
import styles from './styles.scss';

const chairThatWasChanged = (values, formValues, initialValues) => {
  const ids  = Object.keys(values)
  let filterIds = []

  if (!Object.keys(formValues).length) {
    filterIds = ids.filter(id => {
      if (initialValues[id] !== values[id]) {
        return id;
      };
    });
  } else {
    filterIds = ids.filter(id => {
      if (formValues[id] !== values[id]) {
        return id;
      };
    });
  }
  return filterIds;
}

export default function ChairsForm(props) {
  const {
    chairs,
    handleSubmit,
    initialValues,
    formValues,
  } = props;

  if (!chairs) {
    return null;
  }

  return (
    <Form
      form="chairsForm"
      onChange={ (values) => {
        handleSubmit(chairThatWasChanged(values, formValues, initialValues), values);
      }}
      enableReinitialize
      keepDirtyOnReinitialize
      destroyOnUnmount={false}
      alignSave="left"
      initialValues={initialValues}
      ignoreSaveButton
    >
      <div className={styles.formContainer}>
        {chairs.map((chair) => {
          return (
            <div className={styles.chairContainer}>
              <span className={styles.chairContainer_name}>
                {chair.get('name')}
              </span>
              <div className={styles.chairContainer_toggle}>
                <Field
                  component="Toggle"
                  name={chair.get('id')}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Form>
  );
}

