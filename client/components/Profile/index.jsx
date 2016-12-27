import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React from 'react';
import zxcvbn from 'zxcvbn';
import { Button, Form, FormGroup, Label, Input, Progress } from 'reactstrap';
import { changePassword } from '../../thunks/user';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      password: '',
      confirm: '',
      passwordStrength: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.onChangePass = this.onChangePass.bind(this);
  }

  handleChange(e){
    const field = e.target.name;
    const value = e.target.value;
    this.setState({ [field]: value });
    if(field === 'password') {
      const result = zxcvbn(value);
      const strength = (result.score + 1) * 20;
      this.setState({ passwordStrength: strength });
    };
    console.log(this.state);
  }

  onChangePass(e){
    const oldPassword = this.state.oldPassword;
    const password = this.state.password;
    const confirm = this.state.confirm;
    if (password !== confirm) {
      alert('Passwords do not match'); //eslint-disable-line
      e.preventDefault();
      return;
    };
    const result = {
      oldPassword,
      password,
      confirm,
    };
    this.props.changePassword(result);
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <h4>Change your password:</h4>
        <Form>
          <FormGroup>
            <Label for="oldPassword">Your current password</Label>
            <Input type="password" onChange={this.handleChange} name="oldPassword" id="oldPassword" />
          </FormGroup>
          <FormGroup>
            <Label for="password">New password</Label>
            <Input type="password" onChange={this.handleChange} name="password" id="password" />
          </FormGroup>
          <FormGroup>
            <Label for="confirm">Confirm</Label>
            <Input type="password" onChange={this.handleChange} name="confirm" id="confirm" />
            <div className="text-xs-center">{this.state.passwordStrength && 'Password strength'}</div>
            <Progress value={this.state.passwordStrength} />
          </FormGroup>
          <Button onClick={this.onChangePass}>Change password</Button>
        </Form>
      </div>
    );
  }
}

function mapStateToProps() {
  return {
    // username: auth.get('username'),
    // password: auth.get('password'),
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    changePassword,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(Profile);
