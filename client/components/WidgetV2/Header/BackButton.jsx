
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '../../library/Button';
import { historyShape } from '../../library/PropTypeShapes/routerShapes';
import { BackButtonSVG } from '../SVGs';
import styles from './styles.scss';

function BackButton({ history: { goBack } }) {
  return (
    <Button className={styles.backButton} onClick={goBack}>
      <BackButtonSVG />
    </Button>
  );
}

BackButton.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
};

export default withRouter(BackButton);
