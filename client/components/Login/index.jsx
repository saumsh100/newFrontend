import React from 'react';
import styles from './styles.scss';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default class Login extends React.Component {
  render() {
    return (
      <Form className={styles.loginForm}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="text" name="email" id="email" />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input type="password" name="password" id="password" />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
}
