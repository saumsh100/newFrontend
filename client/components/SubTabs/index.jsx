
import React, { Component } from 'react';
import { Tabs, Tab } from '../library';
import styles from './styles.scss';

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
    const { location } = this.props;

    let subTabsComponent = null;
    if (location.pathname.indexOf('/patients') === 0) {
      subTabsComponent = (
        <Tabs index={this.state.index} onChange={this.handleTabChange}>
          <Tab label="Patients" />
          <Tab label="Messages" />
          <Tab label="Phone" />
        </Tabs>
      );
    }

    return subTabsComponent;
  }
}

export default SubTabs;
