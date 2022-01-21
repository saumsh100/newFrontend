import PropTypes from 'prop-types';
import React, { Component } from 'react';
import omit from 'lodash/omit';
import Popover from 'react-popover';
import { compose, withProps } from 'recompose';
import { Field } from 'redux-form';
import RFComponents from './RFComponents';
import { normalizePhone } from './normalize';
import { phoneValidateNullOkay } from './validate';
import styles from './field.scss';

const requiredValidation = (val) => (val ? undefined : 'Required');

class ReduxField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.togglePopOver = this.togglePopOver.bind(this);
  }

  togglePopOver() {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const { type, popover } = this.props;
    let { component = 'Input', validate, normalize } = this.props;

    // Pull from ReduxFormComponent library or else insert a custom one
    if (typeof component === 'string') {
      component = RFComponents[component];
    }

    // add normalizer for phone numbers
    if (type === 'tel') {
      normalize = normalizePhone;
      validate = validate || [];
      validate = [...validate, phoneValidateNullOkay];
    }

    // need to remove required attribute from ReduxField as the Input component uses it
    // extend component attribute for reduxForm's Field props
    const newProps = {
      ...omit(this.props, ['required', 'popover']),
      component,
      normalize,
      validate,
      onClick: this.togglePopOver,
    };

    if (popover) {
      return (
        <Popover
          place="below"
          onOuterAction={this.togglePopOver}
          isOpen={this.state.isOpen}
          tipSize={4}
          body={<div className={styles.toggle}>{popover}</div>}
        >
          <Field {...newProps} />
        </Popover>
      );
    }
    return <Field {...newProps} />;
  }
}

ReduxField.propTypes = {
  popover: PropTypes.string,
  required: PropTypes.bool,
  validate: PropTypes.arrayOf(PropTypes.func),
  type: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  normalize: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

ReduxField.defaultProps = {
  popover: undefined,
  required: false,
  validate: [],
  type: 'text',
  component: 'Input',
  normalize: undefined,
};

const withValidate = withProps(({ required, validate = [] }) => {
  if (!required) return {};

  return {
    validate: [...validate, requiredValidation],
  };
});

const enhance = compose(withValidate);

export default enhance(ReduxField);
