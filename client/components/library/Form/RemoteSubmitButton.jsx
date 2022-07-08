import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash/omit';
import { submit, isInvalid, isPristine } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../StandardButton';
import styles from './styles.scss';

function RemoteSubmitButton(props) {
  const { form, removePristineCheck } = props;

  const newProps = omit(props, ['form', 'onClick', 'isInValid', 'removePristineCheck']);
  const newOnClick = () => {
    props.submit(form);
  };

  return (
    <Button
      disabled={props.isInValid || (!removePristineCheck ? props.isPristine : false)}
      {...newProps}
      onClick={newOnClick}
      variant="primary"
      className={styles.remoteSubmitButton}
    >
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
  removePristineCheck: PropTypes.bool,
};

RemoteSubmitButton.defaultProps = {
  removePristineCheck: false,
};

export default connect(mapStateToProps, mapActionsToProps)(RemoteSubmitButton);
