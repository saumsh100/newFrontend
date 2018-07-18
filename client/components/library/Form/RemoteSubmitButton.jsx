
import React, { PropTypes } from 'react';
import { omit } from 'lodash';
import { submit, isInvalid, isPristine } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../Button';

function RemoteSubmitButton(props) {
  const { form } = props;

  const newProps = omit(props, ['form', 'onClick', 'isInValid']);
  const newOnClick = () => {
    props.submit(form);
  };

  return (
    <Button disabled={props.isInValid || props.isPristine} {...newProps} onClick={newOnClick}>
      {props.children}
    </Button>
  );
}

function mapStateToProps(state, { form }) {
  return {
    isInValid: isInvalid(form)(state),
    isPristine: isPristine(form)(state),
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      submit,
    },
    dispatch,
  );
}

RemoteSubmitButton.propTypes = {
  form: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isInValid: PropTypes.bool.isRequired,
  submit: PropTypes.func.isRequired,
  isPristine: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapActionsToProps)(RemoteSubmitButton);
