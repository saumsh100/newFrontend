
import React, { Component } from 'react';
import { RouterTabs } from '../library';
import styles from './styles.scss';

const getRootPath = pathname => pathname;

const ROUTES = {
  '/patients': [
    {
      to: '/patients/list',
      label: 'Patients',
    },
    {
      to: '/patients/messages',
      label: 'Messages',
    },
    {
      to: '/patients/phone',
      label: 'Phone',
      disabled: true,
    },
  ],

  '/schedule': [
    {
      to: '/schedule/calendar',
      label: 'Calendar View',
    },
    {
      to: '/schedule/appointments',
      label: 'Appointments List',
      disabled: true,
    },
  ],
};

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

    // TODO: if we can strip off /${rootPath}/blah/blah then we can simplify below
    let subTabsComponent = null;
    if (location.pathname.indexOf('/patients') === 0) {
      subTabsComponent = (
        <RouterTabs
          location={location}
          routes={ROUTES['/patients']}
        />
      );
    } else if (location.pathname.indexOf('/schedule') === 0) {
      subTabsComponent = (
        <RouterTabs
          location={location}
          routes={ROUTES['/schedule']}
        />
      );
    }

    return subTabsComponent;
  }
}

export default SubTabs;
