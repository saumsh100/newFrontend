import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import styles from './styles.scss';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import login from '../../thunks/auth';
import { setUsername, setPassword } from '../../actions/auth';

class Login extends React.Component {
  setUsername (e) {
    this.props.setUsername(e.target.value)
  }
  setPassword (e) {
    this.props.setPassword(e.target.value)
  }
  login (e) {
    e.preventDefault()
    this.props.login()
  }
  render() {
    return (
      <div className={styles.loginForm}>
        <h4>Log in to CareCru</h4>
        <Form >
          <FormGroup>
            <Label for="email">Email</Label>
            <Input onChange={this.setUsername.bind(this)} type="text" name="email" id="email" value={this.props.username}/>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input onChange={this.setPassword.bind(this)} type="password" name="password" id="password" value={this.props.password}/>
          </FormGroup>
          <Button onClick={this.login.bind(this)}>Submit</Button>
        </Form>
      </div>
    );
  }
}

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