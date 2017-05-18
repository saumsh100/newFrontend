import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { Input } from '../';
import { Provider } from 'react-redux';


// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => {
  return (
    <div>
      {suggestion.firstName}
    </div>
  );
}


class AutoCompleteForm extends Component {
  constructor() {
    super();

    this.state = {
      suggestions: []
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

    if (this.props.className) {
      props.className = this.props.className;
    }

    props.value = this.props.value;

    return (<Input {...props} />
    );
  };

  render() {
    const { suggestions } = this.state;
    const { value, inputProps } = this.props;

    // Autosuggest will pass through all these props to the input element.
    // Finally, render it!
    return (
        <Autosuggest
          suggestions={suggestions}
          renderInputComponent={this.displayField}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          {...this.props}
        />
    );
  }
}

export default AutoCompleteForm;
