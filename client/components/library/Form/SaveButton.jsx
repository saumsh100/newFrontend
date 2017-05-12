
import React, { PropTypes } from 'react';

import Button from '../Button';
import styles from './styles.scss';
import Icon from '../Icon';

export default function SaveButton(props) {
  const {
    pristine,
  } = props;

  return (
    <div className={styles.formActionsWrapper}>
      <div className={styles.formActionsPull}>
        <Button disabled={pristine} type="submit" className={styles.submitButton} icon="floppy-o" >
            Save
        </Button>
      </div>
    </div>
  );
}
SaveButton.propTypes = {
  pristine: PropTypes.bool,
};







