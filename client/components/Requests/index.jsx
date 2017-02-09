
import React, { Component, PropTypes } from 'react';
import RequestList from './RequestList';

class Requests extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { requests } = this.props;

    return (
      <div>
        <RequestList requests={requests} />
      </div>
    );
  }
}

Request.propTypes = {};

export default Requests;

