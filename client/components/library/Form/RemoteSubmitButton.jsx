
import React, { PropTypes } from 'react';
import { omit } from 'lodash';
import { submit } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../Button';

function RemoteSubmitButton(props) {
  const {
    form,
    onClick,
    submit,
  } = props;


  const newProps = omit(props, ['form', 'onClick']);
  const newOnClick = () => {
    submit(form);
    onClick;
  };

  return (
    <Button {...newProps} onClick={newOnClick}>
      {props.children}
    </Button>
  );
}

RemoteSubmitButton.propTypes = {
  form: PropTypes.func.isRequired,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    submit,
  }, dispatch);
}

export default connect(null, mapActionsToProps)(RemoteSubmitButton);

