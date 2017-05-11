
import React, { PropTypes } from 'react';
import AutoComplete from '../../AutoCompleteForm';

export default function RFAutoComplete(props) {
  const {
    input,
    icon,
    label,
    error,
    meta,
  } = props;

  const { touched, asyncValidating, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);
  const finalIcon = asyncValidating ? (<i className={'fa fa-cog fa-spin fa-fw'} />) : icon;

  const inputProps = {
    value: input.value || '',
    onChange: (e, { newValue }) => { input.onChange(newValue); },
    //onKeyDown: this.submit,
    label,
    error,
    icon,
  };


  return (
    <AutoComplete
      value={input.value || ''}
      {...props}
      inputProps={inputProps}
      getSuggestions={{name: input.value || '', id: 'test'}}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFAutoComplete.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  error: PropTypes.string,
};
