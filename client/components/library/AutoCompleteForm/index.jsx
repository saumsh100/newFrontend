
import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { Input } from '../';
import { Provider } from 'react-redux';
import omit from 'lodash/omit';


// input value for every given suggestion.
//const getSuggestionValue = suggestion => suggestion.name;
const renderSuggestion = suggestion => {
  const display = suggestion.display || `${suggestion.firstName} ${suggestion.lastName}` || suggestion.name;
  return (<div data-test-id={`${suggestion.name}Suggestion`} >
    {display}
  </div>);
};

class AutoCompleteForm extends Component {
  constructor() {
    super();

    this.state = {
      suggestions: [],
    };

    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.displayField = this.displayField.bind(this);
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested({ value }) {
    this.props.getSuggestions(value).then((value2) => {
      this.setState({
        suggestions: value2,
      });
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  };

  displayField(props) {
    delete props.className;

    if (props.className) {
      props.className = this.props.className;
    }

    props.classStyles = this.props.classStyles;

    props.value = this.props.value;

    return <Input {...props} data-test-id={this.props['data-test-id']} />;
  };

  render() {
    const { suggestions } = this.state;

    const newProps = omit(this.props, ['value', 'theme']);
    // Autosuggest will pass through all these props to the input element.
    // Finally, render it!
    return (
        <Autosuggest
          suggestions={suggestions}
          renderInputComponent={this.displayField}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          renderSuggestion={renderSuggestion}
          {...newProps}
        />
    );
  }
}

export default AutoCompleteForm;
