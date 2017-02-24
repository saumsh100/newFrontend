
import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';
import Field from './Field';
import FormSection from './FormSection';

/**
 * Given the requiredFields it will generate a validate function to return errors if
 * a field is empty. Note that this is note fired if the form is pristine.
 *
 * @param requiredFields
 * @returns {function(*)}
 */
/*const requiredValidationGenerator = (requiredFields) => {
  return (fields) => {
    const errors = {};
    requiredFields.forEach((name) => {
      if (!fields[name]) {
        errors[name] = 'Required';
      }
    });

    return errors;
  };
};*/

function Form(props) {
  const {
    children,
    handleSubmit,
  } = props;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {children}
      </form>
    </div>
  );
}

Form.propTypes = {
  // name: PropTypes.string.isRequired,
  requiredFields: PropTypes.array,
};

// Name attribute becomes a location in state ({ form: { [name]: { FORM_DATA } } })
const withReduxForm = (BaseComponent) => {
  return reduxForm({
    // validate,
  })(BaseComponent);
};

/*const withValidate = withProps(({ requiredFields = [], children }) => {
  // Parse children to check invidual settings
  children.forEach((child) => {
    // Coniditions to add into requiredFields
    // - ChildElement type does not equal ReduxField
    // - name attribute is falsey (wouldnt even work with ReduxForm)
    // - required attribute is falsey
    // - already exists in requiredFields
    const { name, required } = child.props;
    if (
      child.type.name !== 'ReduxField' ||
      !name ||
      !required ||
      requiredFields.indexOf(name) > -1
    ) return;

    requiredFields.push(name);
  });

  return {
    validate: requiredValidationGenerator(requiredFields),
  };
});*/

const enhance = compose(
  // withValidate,
  withReduxForm,
);

export default enhance(Form);

export {
  Field,
  FormSection,
};
