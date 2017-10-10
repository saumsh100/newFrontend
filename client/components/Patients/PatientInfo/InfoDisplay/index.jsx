import React, { Component, PropTypes } from 'react';
import { Card } from '../../../library';

export default function InfoDisplay(props) {
  return (
    <Card>
      {props.patientId}
    </Card>
  );
}
