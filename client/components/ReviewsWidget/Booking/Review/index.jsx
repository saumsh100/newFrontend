
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Link,
} from '../../../library';

export default class Review extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Review & Book</h2>
        <Link to="./complete">
          <Button>Submit</Button>
        </Link>
      </div>
    );
  }
}
