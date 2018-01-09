
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { updateReview } from '../../../thunks/reviews';
import { createPatient } from '../../../thunks/patientAuth';
import { Link, Button } from '../../library';
import SignUpForm from './SignUpForm';
import styles from './styles.scss';

const customSubmitButton = (
  <Button
    type="submit"
    icon="email"
    className={styles.customSubmitButton}
  >
    Save and continue
  </Button>
);

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp(values) {
    // true argument is to ignore sending confirmation text on API
    return this.props.createPatient(values)
      .then(() => {
        // TODO: this should be conditional based on where the component came from
        // Important to return so that it will not navigate if errored
        // return this.props.updateReview();


      })
      .then(() => {
        // TODO: this should be conditional based on where the component came from
        this.props.history.push('./signup/confirm');
      });
  }

  render() {
    return (
      <div className={styles.signUpWrapper}>
        <div className={styles.header}>
          Sign Up
        </div>
        <Link to="./login">
          Already have an account? Log in.
        </Link>
        <SignUpForm
          initialValues={{}}
          onSubmit={this.handleSignUp}
          submitButton={customSubmitButton}
          className={styles.signUpForm}
        />
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
