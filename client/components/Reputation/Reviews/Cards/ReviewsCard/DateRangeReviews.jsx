
import PropTypes from 'prop-types';
import React from 'react';
import { DropdownMenu, Form, Field } from '../../../../library';
import styles from '../../styles.scss';

export default function DateRangeReviews(props) {
  const { UserMenu, submitDate, initialValues } = props;

  return (
    <DropdownMenu labelComponent={UserMenu} closeOnInsideClick={false}>
      <Form
        form="dates"
        onSubmit={submitDate}
        alignSave="left"
        className={styles.dateRangeDD}
        initialValues={initialValues}
      >
        <Field
          required
          component="DayPicker"
          name="startDate"
          label="Start Date"
        />
        <Field required component="DayPicker" name="endDate" label="End Date" />
      </Form>
    </DropdownMenu>
  );
}
