
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, InfiniteScroll } from '../../library';

export default class PatientsList extends Component {
  constructor() {}

  render() {
    return (
      <div>
        <h1>Patients List</h1>
        <Card />
      </div>
    );
  }
}
