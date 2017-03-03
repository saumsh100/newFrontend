
import React, { PropTypes } from 'react';

import Button from '../Button';
import styles from './styles.scss';

export default function SaveButton(props) {
  const {
    pristine,
  } = props;

  return (
    <div className={styles.formActionsWrapper}>
      <div className={styles.formActionsPull}>
        <Button flat disabled={pristine} type="submit" className={styles.submitButton} >
          Save
        </Button>
      </div>
    </div>
  );
}
SaveButton.propTypes = {
};







