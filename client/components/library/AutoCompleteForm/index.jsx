import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import { Input } from '..';
import { StyleExtender } from '../../Utils/Themer';
import baseTheme from './theme.scss';

const renderSuggestion = (suggestion) => {
  const display =
    suggestion.display || `${suggestion.firstName} ${suggestion.lastName}` || suggestion.name;
  return <div data-test-id={`${suggestion.name}Suggestion`}>{display}</div>;
};

class AutoCompleteForm extends Component {
  constructor() {
    super();

    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.displayField = this.displayField.bind(this);
    this.state = { suggestions: [] };

    this.getSuggestions = debounce(this.onSuggestionsFetchRequested, 300);
  }

  componentDidMount() {
    if (this.props.focusInputOnMount) {
      this.inputComponent.focus();
    }
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested({ value }) {
    return this.props.getSuggestions(value).then((value2) => {
      this.setState({ suggestions: value2 });
    });
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  }

  // TODO: is this really necessary
  displayField(props) {
    delete props.className;
    if (props.className) {
      props.className = this.props.className;
    }
    props.theme = this.props.theme;
    props.noBorder = this.props.noBorder;
    const isSmallSearch = props.placeholder === 'Search...';

    return (
      <Input
        {...props}
        refCallBack={(node) => {
          this.inputComponent = node;
          return null;
        }}
        data-test-id={this.props['data-test-id']}
        ref={() => props.ref(this.inputComponent)}
        rounded={isSmallSearch}
        noBorder={props.noBorder}
      />
    );
  }

  render() {
    const newProps = omit(this.props, ['value', 'theme', 'suggestionsContainerComponent']);
    // Autosuggest will pass through all these props to the input element.
    // Finally, render it
    return (
      <Autosuggest
        theme={StyleExtender(this.props.theme, baseTheme)}
        suggestions={this.state.suggestions}
        renderInputComponent={this.displayField}
        onSuggestionsFetchRequested={this.getSuggestions}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        renderSuggestion={renderSuggestion}
        renderSuggestionsContainer={this.props.renderSuggestionsContainer}
        focusInputOnSuggestionClick={false}
        {...newProps}
      />
    );
  }
}

AutoCompleteForm.propTypes = {
  label: PropTypes.string,
  classStyles: PropTypes.string,
  className: PropTypes.objectOf(PropTypes.string),
  theme: PropTypes.objectOf(PropTypes.string),
  suggestionsContainerComponent: PropTypes.element,
  renderSuggestionsContainer: PropTypes.func,
  getSuggestionValue: PropTypes.func.isRequired,
  focusInputOnMount: PropTypes.bool,
  getSuggestions: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  refCallBack: PropTypes.func,
  'data-test-id': PropTypes.string,
  noBorder: PropTypes.bool,
};

AutoCompleteForm.defaultProps = {
  value: '',
  classStyles: '',
  className: {},
  theme: {},
  suggestionsContainerComponent: null,
  focusInputOnMount: false,
  label: '',
  renderSuggestionsContainer: undefined,
  'data-test-id': '',
  refCallBack: (e) => e,
  noBorder: false,
};

export default AutoCompleteForm;
