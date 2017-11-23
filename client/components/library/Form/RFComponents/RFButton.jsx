
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import Button from '../../Button';

export default function RFButton(props) {
  const {
    input,
    icon,
    label,
    error,
    meta,
    val,
  } = props;

  const newProps = omit(props, ['input', 'meta',]);
  const { touched, asyncValidating, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);
  const finalIcon = asyncValidating ? (<i className={'fa fa-cog fa-spin fa-fw'} />) : icon;


  return (
    <Button onClick={e => input.onChange(val)}>
      {label}
    </Button>
  );
}

/* eslint react/forbid-prop-types: 0 */
RFButton.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  type: PropTypes.string,
  error: PropTypes.func,
  value: PropTypes.string,
};
