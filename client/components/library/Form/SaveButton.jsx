
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Button from '../Button';
import styles from './styles.scss';
import Icon from '../Icon';

export default function SaveButton(props) {
  const {
    pristine,
    alignSave,
  } = props;

  // TODO: is this alignSave necessary?
  let saveClasses = styles.submitButton;
  if (alignSave) {
    saveClasses = classnames(saveClasses, styles[alignSave]);
  }

  return (
    <Button
      disabled={pristine}
      type="submit"
      className={saveClasses}
    >
      Save
    </Button>
  );
}

SaveButton.propTypes = {
  pristine: PropTypes.bool,
};
