
import React, { Component } from 'react';
import { DropdownSelect } from '../../library';

export default class TestSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'Edmonton',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ value });
  }

  render() {
    return (
      <DropdownSelect
        value={this.state.value}
        onChange={this.handleChange}
        options={[
          { value: 'Edmonton' },
          { value: 'Calgary' },
          { value: 'VancouverLooooooong' },
        ]}
      />
    );
  }
}

