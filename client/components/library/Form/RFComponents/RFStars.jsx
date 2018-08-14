
import PropTypes from 'prop-types';
import React from 'react';
import Stars from '../../Stars';

export default function RFSelect(props) {
  const { input } = props;

  return <Stars {...input} />;
}

/* eslint react/forbid-prop-types: 0 */
RFSelect.propTypes = {
  input: PropTypes.object,
};
