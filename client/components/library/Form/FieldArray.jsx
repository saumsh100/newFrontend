
import React, { PropTypes } from 'react';
import { FieldArray as RFFieldArray } from 'redux-form';

export default function FieldArray(props) {
  return <RFFieldArray {...props} />;
}

FieldArray.propTypes = {};
