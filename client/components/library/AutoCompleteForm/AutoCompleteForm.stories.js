
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import Autosuggest from 'react-autosuggest';
import AutoCompleteForm from './';

// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [
  { name: 'C', year: 1972 },
  { name: 'Elm', year: 2012 },
  { name: 'C++', year: 1972 },
  { name: 'Basic', year: 1972 },
  { name: 'Java', year: 1982 },
  { name: 'Javascript', year: 1992 },
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  return new Promise((resolve, reject) => {

    console.log('value', value);
    if (!value) return resolve([]);

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    const suggestions = inputLength === 0 ? [] : languages.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue,
    );

    //resolve(suggestions.length ? suggestions : [{ none: true }]);
    resolve(suggestions);
  });
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => (suggestion && suggestion.name) || '';

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => {
  /*if (suggestion.none) {
    return (
      <div>
        No Suggestions Found
      </div>
    );
  } else {*/
    return (
      <div>
        <div>
          Name: {suggestion.name}
        </div>
        <div>
          Year: {suggestion.year}
        </div>
      </div>
    );
  //}
};


const renderSuggestionsContainer = ({ containerProps, children, isFetchingSuggestions }) => {
  return (
    <div {...containerProps}>
      {children}
    </div>
  );
};

class AsyncAutoComplete extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: [],
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue,
    });
  }

  render() {
    const { value } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type a programming language',
      value,
      onChange: this.onChange,
    };

    return (
      <AutoCompleteForm
        getSuggestions={getSuggestions}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSuggestionsContainer={renderSuggestionsContainer}
        inputProps={inputProps}
        onSuggestionSelected={(event, { suggestion }) => this.setState({ value: suggestion.name })}
      />
    );
  }
}

storiesOf('AutoComplete', module)
  .addDecorator(withKnobs)
  .add('AsyncAutoComplete', () => (
    <AsyncAutoComplete />
  ));
