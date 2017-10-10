
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Link,
} from '../../../library';

export default class Availabilities extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Availabilities</h2>
        <Link to="./book/wait">
          <Button>Join Waitlist</Button>
        </Link>
        <Link to="./book/review">
          <Button>Next</Button>
        </Link>
      </div>
    );
  }
}
