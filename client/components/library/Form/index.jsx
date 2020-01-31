
import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { compose } from 'recompose';
import Field from './Field';
import FieldArray from './FieldArray';
import FormSection from './FormSection';
import FormButton from './FormButton';
import RemoteSubmitButton from './RemoteSubmitButton';
import { isHub } from '../../../util/hub';
import DashboardStyles from './styles.scss';
import ElectronStyles from './Electron/styles.scss';

const styles = isHub() ? ElectronStyles : DashboardStyles;

function Form(props) {
  const {
    children,
    className,
    handleSubmit,
    pristine,
    ignoreSaveButton,
    SaveButton,
    saveButtonProps,
  } = props;

  const showSubmitButton = !ignoreSaveButton && (
    <SaveButton pristine={pristine} {...saveButtonProps} />
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
        {showSubmitButton && <div className={styles.submitButton}>{showSubmitButton}</div>}
      </form>
    </div>
  );
}

Form.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  ignoreSaveButton: PropTypes.bool,
  SaveButton: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  saveButtonProps: PropTypes.instanceOf(Object),
  'data-test-id': PropTypes.string,
};

Form.defaultProps = {
  children: null,
  className: null,
  pristine: false,
  ignoreSaveButton: false,
  SaveButton: FormButton,
  saveButtonProps: {},
  'data-test-id': null,
};

// Name attribute becomes a location in state ({ form: { [name]: { FORM_DATA } } })
const withReduxForm = BaseComponent => reduxForm()(BaseComponent);

const enhance = compose(withReduxForm);

export default enhance(Form);

export { Field, FieldArray, FormSection, FormButton, RemoteSubmitButton };
