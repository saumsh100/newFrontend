import React, { Component, PropTypes } from 'react';
import { Card } from '../../../library';

export default function Timeline(props) {
  return (
    <Card>
      {props.patientId}
    </Card>
  );
}
