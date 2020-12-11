
import PropTypes from 'prop-types';
import React from 'react';
import { DropdownMenu, Form, Field } from '../../../../library';
import styles from '../../styles.scss';

export default function DateRangeReviews(props) {
  const { UserMenu, submitDate, initialValues, timezone } = props;

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
          timezone={timezone}
        />
        <Field required timezone={timezone} component="DayPicker" name="endDate" label="End Date" />
      </Form>
    </DropdownMenu>
  );
}

DateRangeReviews.propTypes = {
  UserMenu: PropTypes.objectOf(PropTypes.any).isRequired,
  submitDate: PropTypes.func.isRequired,
  initialValues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  timezone: PropTypes.string.isRequired,
};

DateRangeReviews.defaultProps = {
  initialValues: null,
};
