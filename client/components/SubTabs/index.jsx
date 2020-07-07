
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RouterTabs } from '../library';

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
    }, */
  ],

  '/settings': [
    {
      to: '/settings/practice',
      label: 'Practice',
    },
    {
      to: '/settings/reasons',
      label: 'Reasons',
    },
    {
      to: '/settings/practitioners',
      label: 'Practitioners',
    },
    {
      to: '/settings/donna',
      label: 'Donna',
    },
    {
      to: '/settings/forms',
      label: 'Forms',
      flag: 'forms-tab-in-practice-settings',
    },
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

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(index) {
    alert(`Changing to tab ${index}`);
  }

  render() {
    const {
      location: { pathname },
      featureFlags,
    } = this.props;

    const activeRoute = Object.keys(ROUTES).find(route => pathname.indexOf(route) === 0);
    const routes = ROUTES[activeRoute].filter(({ flag }) => !flag || featureFlags.getIn(['flags', flag]));
    return activeRoute ? <RouterTabs routes={routes} /> : null;
  }
}

SubTabs.propTypes = { location: PropTypes.objectOf(PropTypes.any).isRequired };

const mapStateToProps = ({ featureFlags }) => {
  return {
    featureFlags,
  };
};

const enhance = connect(
  mapStateToProps,
  null,
);

export default enhance(SubTabs);
