import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { Field, Form } from '../';
import {reduxForm} from 'redux-form';
import { createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { Provider } from 'react-redux';

function mockFormStore(initialState = {}) {
  const store = createStore((state = initialState, action) => {
    return Object.assign({}, state, {
      form: formReducer(state.form, action),
    });
  });

  return store;
}

const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'Elm',
    year: 2012
  },
  {
    name: 'Elme',
    year: 2012
  },
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input element
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);

const displayField = (props) => {
  delete props.className;

  return (<Field {...props} />
  );
};

class AutoCompleteForm extends Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.submit = this.submit.bind(this);
  }

  onChange(event, { newValue }) {
    console.log(event.target.value)
    console.log(event.target.value)
    this.setState({
      value: newValue
    });
    event.target.value = newValue;
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  submit(value) {
    console.log(value);
  };

  render() {
    const { value, suggestions } = this.state;
    const store = mockFormStore();

    // Autosuggest will pass through all these props to the input element.
    const inputProps = {
      placeholder: 'Type a programming language',
      value,
      onChange: this.onChange,
    };

    // Finally, render it!
    return (
      <Provider store={store}>
        <Form
          form="patientList"
          ignoreSaveButton
          onSubmit={this.submit}
        >
          <Autosuggest
            suggestions={suggestions}
            renderInputComponent={displayField}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            {...this.props}
          />
        </Form>
      </Provider>
    );
  }
}

export default AutoCompleteForm;
