
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import TextArea from '../../TextArea';

export default function RFTextArea(props) {
  const {
    input,
    error,
    label,
    value,
    meta,
  } = props;

  const { touched, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);
  const newProps = omit(props, ['input', 'meta', 'error', 'va']);
  return (
    <TextArea
      {...newProps}
      {...input}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFTextArea.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.string,
  label: PropTypes.string,
};
