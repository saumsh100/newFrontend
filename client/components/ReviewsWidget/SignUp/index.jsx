
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { updateReview } from '../../../thunks/reviews';
import { createPatient } from '../../../thunks/patientAuth';
import { Link, VButton } from '../../library';
import SignUpForm from '../../Availabilities/SubmitView/SignUpForm';
import styles from './styles.scss';

const customSubmitButton = (
  <VButton
    type="submit"
    color="red"
    icon="email"
    className={styles.customSubmitButton}
  >
    Sign Up with Email
  </VButton>
);

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp(values) {
    // true argument is to ignore sending confirmation text on API
    return this.props.createPatient(values, true)
      .then(() => {
        // Important to return so that it will not navigate if errored
        return this.props.updateReview();
      })
      .then(() => {
        this.props.history.push('/submitted');
      });
  }

  render() {
    return (
      <div className={styles.signUpWrapper}>
        <h2>Signup</h2>
        <SignUpForm
          initialValues={{}}
          onSubmit={this.handleSignUp}
          submitButton={customSubmitButton}
        />
        <Link to="./login">
          <h3>Or Login</h3>
        </Link>
      </div>
    );
  }
}

SignUp.propTypes = {
  updateReview: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createPatient,
    updateReview,
  }, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(SignUp));
