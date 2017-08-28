
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../../library';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import styles from '../styles.scss';

class ResetPassword extends Component {
  render() {
    return (
      <div className={styles.backDrop}>
        <Card className={styles.loginForm}>
          <div className={styles.logoContainer}>
            <img
              className={styles.loginLogo}
              src="/images/logo_black.png"
              alt="CareCru Logo"
            />
          </div>
        </Card>
      </div>
    );
  }
}

ResetPassword.propTypes = {

};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(ResetPassword);


