
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
    },
  ],

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
    {
      to: '/intelligence/social',
      label: 'Social',
      disabled: true,
    },
  ],

  /*'/reputation': [
    {
      to: '/reputation/listings',
      label: 'Listings',
    },
    {
      to: '/reputation/reviews',
      label: 'Reviews',
    },
  ],

  '/social': [
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
