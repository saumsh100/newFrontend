
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import { compose, withProps } from 'recompose';
import { Field } from 'redux-form';
import RFComponents from './RFComponents';

const requiredValidation = val => val ? undefined : 'Required';

function ReduxField(props) {
  let { component = 'Input' } = props;

  // Pull from ReduxFormComponent library or else insert a custom one
  if (typeof component === 'string') {
    component = RFComponents[component];
  }

  // need to remove required attribute from ReduxField as the Input component uses it
  // extend component attribute for reduxForm's Field props
  const newProps = Object.assign({}, omit(props, ['required']), { component });
  return <Field {...newProps} />;
}

ReduxField.propTypes = {
  required: PropTypes.bool,
  validate: PropTypes.array,
  component: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
  ]),
};

const withValidate = withProps(({ required, validate = [] }) => {
  if (!required) return {};

  return {
    validate: [...validate, requiredValidation],
  };
});

const enhance = compose(
  withValidate,
);

export default enhance(ReduxField);
