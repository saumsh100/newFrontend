
import React from 'react';
import PropTypes from 'prop-types';
import DropdownSuggestion from './index';

export default function SuggestionSelect(props) {
  const { icon, error, meta, input } = props;

  const { touched, asyncValidating, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);
  const finalIcon = asyncValidating ? (<i className={'fa fa-cog fa-spin fa-fw'} />) : icon;

  return (
    <DropdownSuggestion
      {...input}
      {...props}
      error={finalError}
      icon={finalIcon}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
SuggestionSelect.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  error: PropTypes.string,
};
