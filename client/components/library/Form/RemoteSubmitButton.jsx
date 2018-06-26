
import React, { PropTypes } from 'react';
import { omit } from 'lodash';
import { submit, isPristine } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../Button';

function RemoteSubmitButton(props) {
  const {
    form, onClick, submit, isPristine,
  } = props;

  const newProps = omit(props, ['form', 'onClick']);
  const newOnClick = (e) => {
    submit(form);
  };

  return (
    <Button {...newProps} onClick={newOnClick}>
      {props.children}
    </Button>
  );
}

RemoteSubmitButton.propTypes = {
  form: PropTypes.string,
};

function mapStateToProps(state, { form }) {
  return {
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

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(RemoteSubmitButton);
