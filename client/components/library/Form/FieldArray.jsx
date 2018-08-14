
import PropTypes from 'prop-types';
import React from 'react';
import { FieldArray as RFFieldArray } from 'redux-form';

export default function FieldArray(props) {
  return <RFFieldArray {...props} />;
}

FieldArray.propTypes = {};
