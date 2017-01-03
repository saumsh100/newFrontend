
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Button, Input } from '../library';
import login from '../../thunks/auth';
import { setUsername, setPassword } from '../../actions/auth';
import styles from './styles.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.login = this.login.bind(this);
  }
  
  setUsername(e) {
    this.props.setUsername(e.target.value);
  }
  
  setPassword(e) {
    this.props.setPassword(e.target.value);
  }
  
  login(e) {
    e.preventDefault();
    this.props.login();
  }
  
  render() {
    return (
      <Card className={styles.loginForm}>
        <h4>Sign In</h4>
        <Input
          id="email"
          onChange={this.setUsername}
          type="text"
          name="email"
          label="Email"
          value={this.props.username}
        />
        <Input
          id="password"
          onChange={this.setPassword}
          type="password"
          name="password"
          label="Password"
          value={this.props.password}
        />
        <Button
          style={{ width: '100%' }}
          onClick={this.login}
        >
          Sign In
        </Button>
      </Card>
    );
  }
}

Login.propTypes = {
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};

function mapStateToProps({ auth }) {
  return {
    username: auth.get('username'),
    password: auth.get('password'),
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    login,
    setUsername,
    setPassword,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(Login);
