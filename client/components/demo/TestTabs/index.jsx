
import React, { Component } from 'react';
import { Card, Tabs, Tab } from '../../library';

class TestTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(index) {
    this.setState({ index });
  }

  render() {
    return (
      <Card>
        <Tabs index={this.state.index} onChange={this.handleTabChange}>
          <Tab label="Calendar">
            <span>Calendar</span>
          </Tab>
          <Tab label="Settings">
            <span>Settings</span>
          </Tab>
          <Tab label="Contact">
            <span>Contact</span>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}

export default TestTabs;
