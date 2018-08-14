
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { updateReview } from '../../../thunks/reviews';
import { confirmCode, resendPinCode } from '../../../thunks/availabilities';
import { Link, Button } from '../../library';
import ConfirmNumberForm from './ConfirmNumberForm';
import styles from './styles.scss';

class ConfirmSignUp extends Component {
  constructor(props) {
    super(props);

    this.confirmAndBook = this.confirmAndBook.bind(this);
    this.resendCode = this.resendCode.bind(this);
  }

  confirmAndBook(values) {
    // true argument is to ignore sending confirmation text on API
    return this.props
      .confirmCode(values)
      .then(() => {
        // TODO: this should be conditional based on where the component came from
        // Important to return so that it will not navigate if errored
        // return this.props.updateReview();
        this.props.history.push('../book/review');
      })
      .catch(({ data }) => {
        throw new SubmissionError({
          confirmCode: data,
        });
      });
  }

  resendCode() {
    this.props.resendPinCode();
  }

  render() {
    const { patientUser } = this.props;

    const resendAnchor = (
      <a
        href="#resend"
        onClick={(e) => {
          e.preventDefault();
          this.resendCode();
        }}
      >
        here
      </a>
    );

    /* const formComponent = (
      <div>
        <div className={styles.messageWrapper}>
          <span>You are currently logged in as <strong>{patientUser.getFullName()}</strong>.
            <br /><br />
            If this is not you, and you would like to logout
            and signin/signup as another user,
            click <a href="#logout" onClick={(e) => {
              e.preventDefault();
              this.logout();
            }}>here</a>.
            <br /><br />
          </span>
          We have sent a confirmation code via SMS to {patientUser.get('phoneNumber')}.
          Please type in the code below and submit to complete your booking.
          If you did not receive your SMS and want it sent again, click {resendAnchor}.
        </div>
      </div>
    ); */

    return (
      <div className={styles.signUpWrapper}>
        <div className={styles.header}>Confirm Signup</div>
        <div className={styles.message}>
          We have sent a confirmation code via SMS to{' '}
          <span className={styles.phone}>{patientUser.get('phoneNumber')}</span>.
          Please type in the code below and submit to complete your booking
          request. If you did not receive your SMS and want it sent again, click{' '}
          {resendAnchor}.
        </div>
        <ConfirmNumberForm
          initialValues={{}}
          onSubmit={this.confirmAndBook}
          className={styles.signUpForm}
        />
      </div>
    );
  }
}

ConfirmSignUp.propTypes = {
  updateReview: PropTypes.func.isRequired,
};

function mapStateToProps({ auth }) {
  return {
    patientUser: auth.get('patientUser'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      confirmCode,
      resendPinCode,
    },
    dispatch,
  );
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmSignUp));
