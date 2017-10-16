
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

  let saveClasses = styles.submitButton;

  if (alignSave) {
    saveClasses = classnames(saveClasses, styles[alignSave]);
  }

  if (pristine) {
    saveClasses = classnames(saveClasses, styles.disabled);
  }

  return (
    <div className={styles.formActionsWrapper}>
      <div className={styles.formActionsPull}>
        <Button disabled={pristine} type="submit" className={saveClasses} icon="floppy-o" >
            Save
        </Button>
      </div>
    </div>
  );
}
SaveButton.propTypes = {
  pristine: PropTypes.bool,
};







