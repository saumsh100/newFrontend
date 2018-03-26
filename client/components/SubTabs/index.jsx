
import React, { Component } from 'react';
import { RouterTabs } from '../library';
import styles from './styles.scss';

const getRootPath = pathname => pathname;

const ROUTES = {
  '/schedule': [
   /* {
      to: '/schedule/calendar',
      label: 'Calendar View',
    },
    {
      to: '/schedule/appointments',
      label: 'Appointments List',
      disabled: true,
    },*/
  ],

  '/settings': [
    {
      to: '/settings/clinic',
      label: 'Clinic',
    },
    {
      to: '/settings/schedule',
      label: 'Schedule',
    },
    {
      to: '/settings/services',
      label: 'Services',
    },
    {
      to: '/settings/practitioners',
      label: 'Practitioners',
    },
    {
      to: '/settings/communications',
      label: 'Communications',
    },
  ],

  '/intelligence': [
    {
      to: '/intelligence/overview',
      label: 'Overview',
    },
    {
      to: '/intelligence/business',
      label: 'Business',
    },
    /*{
      to: '/intelligence/social',
      label: 'Social',
      disabled: true,
    },*/
  ],

  '/reputation': [
    {
      to: '/reputation/reviews',
      label: 'Reviews',
    },
    {
      to: '/reputation/listings',
      label: 'Listings',
    },
  ],

  /* '/social': [
    {
      to: '/social/patient',
      label: 'Patient Posts',
    },
    {
      to: '/social/practice',
      label: 'Practice Posts',
    }],
*/
  '/admin': [
    {
      to: '/admin/enterprises',
      label: 'Enterprises',
    },
    {
      to: '/admin/nasa',
      label: 'NASA',
    },
    {
      to: '/admin/play',
      label: 'Playground',
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
    const { location: { pathname } } = this.props;

    const activeRoute = Object.keys(ROUTES).find(route => pathname.indexOf(route) === 0);

    return activeRoute ?
      <RouterTabs routes={ROUTES[activeRoute]} /> :
      null;
  }
}

export default SubTabs;
