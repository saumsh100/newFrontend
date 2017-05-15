
import React, { Component, PropTypes } from 'react';
import AutoComplete from '../../AutoCompleteForm';

class RFAutoComplete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
    };
    this.setValue = this.setValue.bind(this);
  }

  setValue(newValue) {
    const {
      input,
    } = this.props;

    if (typeof newValue === 'string') {
      input.onChange(newValue);
      return this.setState({ value: newValue });
    } else {
      this.setState({ value: newValue.firstName });
      return input.onChange(newValue);
    }
  }

  render() {
    const {
      icon,
      label,
      error,
      meta,
    } = this.props;

    const { touched, asyncValidating, dirty } = meta;
    const finalError = error || ((touched || dirty) ? meta.error : null);
    const finalIcon = asyncValidating ? (<i className={'fa fa-cog fa-spin fa-fw'} />) : icon;

    const inputProps = {
      value: this.state.value,
      onChange: (e, { newValue }) => {
        return this.setValue(newValue);
      },
      label,
      error: finalError,
      icon: finalIcon,
    };

    return (
      <AutoComplete
        value={this.state.value}
        {...this.props}
        inputProps={inputProps}
        focusInputOnSuggestionClick={false}
      />
    );
  }
}

/* eslint react/forbid-prop-types: 0 */
RFAutoComplete.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  error: PropTypes.string,
};

export default RFAutoComplete;
