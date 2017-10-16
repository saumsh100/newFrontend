/*
import React, { Component, PropTypes } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Input from '../Input/index';
import Button from '../Button/index';
import DropdownSelect from '../DropdownSelect/index';
import DayPicker from '../DayPicker/index';
import Toggle from '../Toggle/index';
import Checkbox from '../Checkbox/index';

const options = [
  { value: 'Edmonton' },
  { value: 'Calgary' },
  { value: 'Vancouver' },
];

class TestFormComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      dropDownSelect: '',
      dayPicker: new Date(),
      submitButton: false,
      value: 'on',
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleDayPicker = this.handleDayPicker.bind(this);
    this.handleDropDownSelect = this.handleDropDownSelect.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e) {
    this.setState({
     input: e.target.value,
    });
  }

  handleDayPicker(day) {
    this.setState({
      dayPicker: new Date(day),
    });
  }

  handleDropDownSelect(value) {
    this.setState({
      dropDownSelect: value,
    });
  }

  handleToggle(e) {
    e.stopPropagation();
    this.setState({
      value: (this.state.value === 'on') ? 'off' : 'on',
    });
  }

  handleSubmit() {
    this.setState({ submitButton: !this.state.submitButton })
  }

  render() {
    const { onChange } = this.props;

    let showConsole = null
    if (this.state.submitButton) {
      showConsole = (
        <div>
          <div>Input: {this.state.input}</div>
          <div>DayPicker: {this.state.dayPicker.toISOString()}</div>
          <div>DropDownSelect: {this.state.dropDownSelect}</div>
          <div>Toggle: {this.state.value}</div>
        </div>
      );
    }

    return (
      <div style={{width: '50%'}}>
        <div style={{alignItems: 'center'}}>
          <DayPicker
            target="icon"
            selectedDays={this.state.dayPicker}
            onChange={this.handleDayPicker}
          />
          <Toggle
            onChange={this.handleToggle}
            value={this.state.value}
            defaultChecked={true}
          />
          <Input
            value={this.state.input}
            label="Enter text"
            onChange={this.handleInput}
          />
        </div>
        <DropdownSelect
          options={options}
          onChange={this.handleDropDownSelect}
          label="Countries"
          value={this.state.dropDownSelect}
        />
        <Checkbox
          checked={this.state.submitButton}
        />
        <Button onClick={this.handleSubmit}>Submit</Button>
        {showConsole}
      </div>
    );
  }
}

storiesOf('TestFormComponents', module)
  .add('All Form Components', () => (
    <TestFormComponents
      onChange={action('change')}
    />
  ));

*/
