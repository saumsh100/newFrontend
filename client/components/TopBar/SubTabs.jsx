
import React, { Component } from 'react';
import { Tabs, Tab } from '../library';

class SubTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(index) {
    alert(`Changing to tab ${index}`);
    this.setState({ index });
  }


  render() {
    return (
      <Tabs index={this.state.index} onChange={this.handleTabChange}>
        <Tab label="Patients" />
        <Tab label="Messages" />
        <Tab label="Email" />
        <Tab label="Phone" />
      </Tabs>
    );
  }
}

export default SubTabs;
