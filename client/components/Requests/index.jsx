
import React, { Component, PropTypes } from 'react';
import RequestList from './RequestList';

class Requests extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const { requests, patients } = this.props;

    return (
      <div>
        <RequestList requests={requests} patients={patients} />
      </div>
    );
  }
}

Request.propTypes = {};

export default Requests;
