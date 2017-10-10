
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Link,
} from '../../../library';

export default class Complete extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Completed</h2>
        <Link to="../book">
          <Button>Back to Beginning</Button>
        </Link>
      </div>
    );
  }
}
