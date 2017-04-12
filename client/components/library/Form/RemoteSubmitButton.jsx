
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../Button';
import styles from './styles.scss';
import Icon from '../Icon';

function SaveButton(props) {
  const {
    form,
    onClick,
    submit,
  } = props;


  const newProps = omit(props, ['form', 'onClick']);
  const newOnClick = (e) => {
    submit(form);
    onClick && onClick(e);
  };

  return (
    <Button {...newProps} onClick={newOnClick} />;
  );
}

SaveButton.propTypes = {
  form: required,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    submit,
  }, dispatch);
}

export default connect(null, mapActionsToProps)(SaveButton);

