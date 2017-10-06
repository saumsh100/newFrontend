import React, { PropTypes } from 'react';
import { Form, Field } from '../../../library';
import styles from './styles.scss';

export default function ChairsForm(props) {
  const {
    chairs,
    handleSubmit,
  } = props;

  if (!chairs) {
    return null;
  }

  return (
    <Form
      form="chairsForm"
      onSubmit={handleSubmit}
      enableReinitialize
      keepDirtyOnReinitialize
      destroyOnUnmount={false}
      alignSave="left"
    >
      <div className={styles.formContainer}>
        {chairs.map((chair) => {
          return (
            <div className={styles.chairContainer}>
              <span className={styles.chairContainer_name}>
                {chair.get('name')}
              </span>
              <Field
                component="Toggle"
                name={chair.get('id')}
              />
            </div>
          );
        })}
      </div>
    </Form>
  );
}
