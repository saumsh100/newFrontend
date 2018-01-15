
import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { compose, withProps } from 'recompose';
import Field from './Field';
import FieldArray from './FieldArray';
import FormSection from './FormSection';
import FormButton from './FormButton';
import RemoteSubmitButton from './RemoteSubmitButton';
import { asyncEmailValidate } from './validate';
import styles from './styles.scss';

function Form(props) {
  const {
    children,
    className,
    handleSubmit,
    pristine,
    ignoreSaveButton,
    SaveButton = FormButton,
    saveButtonProps = {},
  } = props;

  const showSubmitButton = ignoreSaveButton ? null : (
    <SaveButton
      pristine={pristine}
      {...saveButtonProps}
    />
  );

  return (
    <div>
      <form
        className={className}
        onSubmit={handleSubmit}
        onChange={e => e.stopPropagation()}
        data-test-id={props['data-test-id']}
      >
        {children}
        {showSubmitButton && (
          <div className={styles.submitButton}>
            {showSubmitButton}
          </div>
        )}
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

  })(BaseComponent);
};

const enhance = compose(
  // withValidate,
  withReduxForm,
);

export default enhance(Form);

export {
  Field,
  FieldArray,
  FormSection,
  FormButton,
  RemoteSubmitButton,
};
