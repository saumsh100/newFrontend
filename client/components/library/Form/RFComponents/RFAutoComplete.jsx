
import React, { Component, PropTypes } from 'react';
import AutoComplete from '../../AutoCompleteForm';
import Icon from '../../Icon';

class RFAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.input.value,
    };
    this.setValue = this.setValue.bind(this);
  }

  setValue(newValue) {
    const { input } = this.props;

    if (typeof newValue === 'string') {
      input.onChange(newValue);
      return this.setState({ value: newValue });
    } else if (typeof newValue === 'object') {
      this.setState({ value: `${newValue.firstName} ${newValue.lastName}` });
      return input.onChange(newValue);
    }
    return null;
  }

  render() {
    const {
      icon, label, error, meta, input, theme, placeholder,
    } = this.props;

    const { touched, asyncValidating, dirty } = meta;
    const finalError = error || (touched || dirty ? meta.error : null);
    const finalIcon = asyncValidating ? (
      <i className="fa fa-cog fa-spin fa-fw" />
    ) : (
      icon
    );

    let propsValue = input.value;
    if (typeof propsValue === 'object') {
      propsValue = `${input.value.firstName} ${input.value.lastName}`;
    }

    const inputProps = {
      value: propsValue,
      onChange: (e, { newValue }) => this.setValue(newValue),
      error: finalError,
      icon: finalIcon,
      theme,
      placeholder,
      onBlur: this.props.onBlurFunction,
    };

    const getSuggestionValue = suggestion => suggestion;

    return (
      <AutoComplete
        value={propsValue}
        focusInputOnSuggestionClick={false}
        getSuggestionValue={getSuggestionValue}
        {...this.props}
        inputProps={inputProps}
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
