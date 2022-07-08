import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Button from '../components/Button';
import { hideButton } from '../../../reducers/widgetNavigation';
import { historyShape } from '../../library/PropTypeShapes/routerShapes';
import { BackButtonSVG } from '../SVGs';
import styles from './styles.scss';

function BackButton({ history: { goBack }, ...props }) {
  return (
    <Button
      className={styles.backButton}
      onClick={() => {
        props.hideButton();
        return goBack();
      }}
    >
      <BackButtonSVG />
    </Button>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      hideButton,
    },
    dispatch,
  );
}

BackButton.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  hideButton: PropTypes.func.isRequired,
};

export default withRouter(connect(null, mapDispatchToProps)(BackButton));
