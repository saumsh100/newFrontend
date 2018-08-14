
import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash/omit';
import { inputShape, metaShape } from '../../PropTypeShapes/inputShape';
import TextArea from '../../TextArea';

export default function RFTextArea(props) {
  const { input, error, meta } = props;

  const { touched, dirty } = meta;
  const finalError = error || ((touched || dirty) && meta.error);
  const newProps = { ...omit(props, ['input', 'meta', 'error']), error: finalError };
  return <TextArea {...newProps} {...input} error={finalError} />;
}

/* eslint react/forbid-prop-types: 0 */
RFTextArea.propTypes = {
  input: PropTypes.shape(inputShape).isRequired,
  meta: PropTypes.shape(metaShape).isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

RFTextArea.defaultProps = {
  error: '',
};
