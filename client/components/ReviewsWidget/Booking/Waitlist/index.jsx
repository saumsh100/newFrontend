
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Link,
} from '../../../library';

export default class Waitlist extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Waitlist</h2>
        <Link to="../book">
          <Button>Back</Button>
        </Link>
        <Link to="../book">
          <Button>Save</Button>
        </Link>
      </div>
    );
  }
}
