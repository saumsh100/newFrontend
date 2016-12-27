
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Button } from '../library';
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
      <div className={styles.loginForm}>
        <h4>Log in to CareCru</h4>
        <Form>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input onChange={this.setUsername} type="text" name="email" id="email" value={this.props.username}/>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input onChange={this.setPassword} type="password" name="password" id="password" value={this.props.password}/>
          </FormGroup>
          <Button
            style={{ width: '100%' }}
            onClick={this.login.bind(this)}
          >
            Sign In
          </Button>
        </Form>
      </div>
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
