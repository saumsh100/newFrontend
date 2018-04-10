
import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { Provider } from 'react-redux';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import { Input, Icon } from '../';
import { StyleExtender } from '../../Utils/Themer';
import baseTheme from './theme.scss';

const renderSuggestion = suggestion => {
  const display = suggestion.display || `${suggestion.firstName} ${suggestion.lastName}` || suggestion.name;
  return (
    <div data-test-id={`${suggestion.name}Suggestion`}>
      {display}
    </div>
  );
};

class AutoCompleteForm extends Component {
  constructor() {
    super();

    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.displayField = this.displayField.bind(this);
    this.state = {
      suggestions: [],
      isFetchingSuggestions: false,
    };

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
    this.setState({ isFetchingSuggestions: true });
    return this.props.getSuggestions(value)
      .then((value2) => {
        this.setState({
          suggestions: value2,
          isFetchingSuggestions: false,
        });
      });
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  // TODO: is this really necessary
  displayField(props) {
    delete props.className;

    if (props.className) {
      props.className = this.props.className;
    }
    props.theme = this.props.theme;
    props.value = this.props.value;
    props.ref = this.props.refCallBack;

    return (
      <Input
        {...props}
        ref={null}
        refCallBack={node => this.inputComponent = node}
        data-test-id={this.props['data-test-id']}
      />
    );
  }

  render() {
    const {
      suggestions,
      isFetchingSuggestions,
    } = this.state;

    const newProps = omit(this.props, ['value', 'theme', 'suggestionsContainerComponent']);
    // Autosuggest will pass through all these props to the input element.
    // Finally, render it
    return (
      <Autosuggest
        theme={StyleExtender(this.props.theme, baseTheme)}
        suggestions={suggestions}
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

AutoCompleteForm.defaultProps = {
  renderSuggestionsContainer: ({ containerProps, children }) => <div {...containerProps}>{children}</div>,
};

// TODO; get proper propTypes and defaultValues
AutoCompleteForm.propTypes = {
  label: PropTypes.string,
  classStyles: PropTypes.object,
  className: PropTypes.object,
  theme: PropTypes.object,
  suggestionsContainerComponent: PropTypes.component,
  renderSuggestionsContainer: PropTypes.func,
  getSuggestionValue: PropTypes.func.isRequired,
  focusInputOnMount: PropTypes.bool,
};

export default AutoCompleteForm;
