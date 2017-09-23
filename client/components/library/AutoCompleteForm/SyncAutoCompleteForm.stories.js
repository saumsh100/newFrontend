
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
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


const getSuggestions = (value) => {
  return new Promise((resolve) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return resolve(inputLength === 0 ? [] : languages.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    ));
  });
};

class SyncAutoCompleteForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue,
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
        getSuggestions={getSuggestions}
        inputProps={inputProps}
      />
    );
  }
}


storiesOf('AutoComplete', module)
  .addDecorator(withKnobs)
  .add('SyncAutoCompleteForm', () => (
    <SyncAutoCompleteForm />
  ));
