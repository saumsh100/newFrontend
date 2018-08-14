
import PropTypes from 'prop-types';
import React from 'react';
import { Form, Field } from '../../../library';

function ReviewForm(props) {
  const { onSubmit, initialValues } = props;
  return (
    <Form
      form="createReviewForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      enableReinitialize
      ignoreSaveButton
    >
      <Field required name="stars" component="Stars" />
      <Field required name="description" label="Description" />
    </Form>
  );
}

ReviewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

export default ReviewForm;
