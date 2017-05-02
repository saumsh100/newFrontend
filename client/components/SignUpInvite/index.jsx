
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../library';
import invite from '../../thunks/inviteSignup';
import InviteForm from './InviteForm';
import styles from './styles.scss';

class SignUpInvite extends Component {
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
          <InviteForm onSubmit={this.props.invite.bind(null, this.props.location)} />
        </Card>
      </div>
    );
  }
}

SignUpInvite.propTypes = {
  invite: PropTypes.func.isRequired,
  location: PropTypes.object,
};


function mapActionsToProps(dispatch) {
  return bindActionCreators({
    invite,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(SignUpInvite);
