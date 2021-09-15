import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { Form, Field } from '../../../../library';

const OmitForm = (props) => {
  const generateInitialValues = (value, toggles) => {
    const trueValues = toggles.reduce((acc, toggle) => ({ ...acc, [toggle.id]: true }), {});

    const falseValues = value.reduce((acc, v) => ({ ...acc, [v]: false }), {});

    return {
      ...trueValues,
      ...falseValues,
    };
  };

  const handleSubmit = (values) => {
    const omittedValues = map(values, (item, key) => !item && key).filter((key) => key !== false);
    props.onChange(omittedValues);
  };

  const { disabled, value, toggles, formName, renderToggles, toggleComponentProps } = props;

  return (
    <Form
      ignoreSaveButton
      form={formName}
      initialValues={generateInitialValues(value, toggles)}
      onChange={handleSubmit}
    >
      {toggles.map((toggle) =>
        // this render prop returns both the component that should be rendered
        // and the data tha is being parsed.
        renderToggles({
          toggleComponent: (renderProps) => (
            <ToggleComponent {...renderProps} {...toggleComponentProps} disabled={disabled} />
          ),
          toggleProps: toggle,
        }),)}
    </Form>
  );
};

const ToggleComponent = (toggleComponentProps) => (
  <Field component="Toggle" {...toggleComponentProps} />
);

OmitForm.propTypes = {
  disabled: PropTypes.bool.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  formName: PropTypes.string.isRequired,
  toggles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  renderToggles: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  toggleComponentProps: PropTypes.shape({
    popover: PropTypes.string,
    required: PropTypes.bool,
    validate: PropTypes.arrayOf(PropTypes.func),
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    type: PropTypes.string,
  }),
};

OmitForm.defaultProps = {
  toggleComponentProps: {},
};

export default OmitForm;
