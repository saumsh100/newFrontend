import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import classNames from 'classnames';
import ColorPicker from '../../ColorPicker';

export default function RFColorPicker(props) {
  const {
    input,
    error,
    label,
    value,
    meta,
  } = props;

  const { touched, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);
  const newProps = omit(props, ['meta', 'error', 'input']);
  const newInput = omit(input, ['value']);

  return (
    <ColorPicker
      {...newProps}
      {...newInput}
      color={input.value}
      onChange={(color) => input.onChange(color.hex)}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFColorPicker.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.string,
  label: PropTypes.string,
};
