
import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { boolean, withKnobs } from '@kadira/storybook-addon-knobs';
import AutoCompleteForm from './';

const languages = [
  {
    name: 'C',
    year: 1972,
  },
  {
    name: 'Elm',
    year: 2012,
  },
  {
    name: 'Elmedasdlsadjksadhs',
    year: 2012,
  },
];


class AsyncAutoCompleteForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      languages: [
        {
          name: 'Elm',
          year: 2012,
        },
      ],
    };
    this.onChange = this.onChange.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.asyncCall = this.asyncCall.bind(this);
  }

  getSuggestions(value) {
    return new Promise((resolve) => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;
      return resolve(inputLength === 0 ? [] : this.state.languages.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
      ));
    });
  };

  asyncCall(callback) {
    setTimeout(callback, 300);
  }

  onChange(event, { newValue }) {
    this.asyncCall(() => {
      this.setState({
        languages,
        value: newValue,
      });
    });
  };


  render() {
    const inputProps = {
      placeholder: 'Type a programming language',
      value: this.state.value,
      onChange: this.onChange,
    };

    return (
      <AutoCompleteForm
        value={this.state.value}
        getSuggestions={this.getSuggestions}
        inputProps={inputProps}
      />
  );
  }
}


storiesOf('AutoComplete', module)
  .addDecorator(withKnobs)
  .add('AsyncAutoCompleteForm', () => (
    <AsyncAutoCompleteForm />
));
