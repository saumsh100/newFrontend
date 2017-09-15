
import React, { PropTypes } from 'react';
import {
  Form,
  Field,
} from '../../../library';

function ReviewForm(props) {
  let initialValues = {};
  if (props.review) {
    const { stars, description } = props.review.toJS();
    initialValues = { stars, description };
  }

  return (
    <Form
      form="createReviewForm"
      onSubmit={props.onSubmit}
      initialValues={initialValues}
    >
      <Field
        required
        name="stars"
        component="Stars"
      />
      <Field
        required
        name="description"
        label="Description"
      />
    </Form>
  );
}

ReviewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ReviewForm;
