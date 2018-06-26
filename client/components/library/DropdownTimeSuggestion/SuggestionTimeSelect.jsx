
import React from 'react';
import PropTypes from 'prop-types';
import DropdownTimeSuggestion from './index';

export default function SuggestionTimeSelect(props) {
  const {
    icon, error, meta, input,
  } = props;

  const { touched, asyncValidating, dirty } = meta;
  const finalError = error || (touched || dirty ? meta.error : null);
  const finalIcon = asyncValidating ? (
    <i className="fa fa-cog fa-spin fa-fw" />
  ) : (
    icon
  );

  return (
    <DropdownTimeSuggestion
      {...input}
      {...props}
      error={finalError}
      icon={finalIcon}
    />
  );
}

SuggestionTimeSelect.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  error: PropTypes.string,
};
