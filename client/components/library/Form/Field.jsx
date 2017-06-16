
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import { compose, withProps } from 'recompose';
import { Field } from 'redux-form';
import RFComponents from './RFComponents';
import { normalizePhone } from './normalize';
import { phoneNumberValidate } from './validate';

const requiredValidation = val => val ? undefined : 'Required';

function ReduxField(props) {
  const { type } = props;
  let { component = 'Input', validate, normalize } = props;

  // Pull from ReduxFormComponent library or else insert a custom one
  if (typeof component === 'string') {
    component = RFComponents[component];
  }
  // add normalizer for phone numbers
  if (type === 'tel') {
    // TODO: we are currently overriding the normalize for tel, they should be able to stack (compose)
    normalize = normalizePhone;
    validate = [...validate, phoneNumberValidate];
  }

  // need to remove required attribute from ReduxField as the Input component uses it
  // extend component attribute for reduxForm's Field props
  const newProps = Object.assign({}, omit(props, ['required']), { component, normalize, validate });
  return <Field {...newProps} />;
}

ReduxField.propTypes = {
  required: PropTypes.bool,
  validate: PropTypes.arrayOf(PropTypes.func),
  component: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
  ]),

  type: PropTypes.string,
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
