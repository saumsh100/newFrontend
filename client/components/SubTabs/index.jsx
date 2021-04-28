import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RouterTabs } from '../library';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';

const ROUTES = {
  '/schedule': [],

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

const SubTabs = (props) => {
  const {
    location: { pathname },
    featureFlags,
  } = props;

  const activeRoute = Object.keys(ROUTES).find((route) => pathname.indexOf(route) === 0);
  if (!activeRoute) return null;

  const routes = ROUTES[activeRoute].filter(
    ({ flag }) => !flag || featureFlags.getIn(['flags', flag]),
  );

  const updatedRoutes = routes.map((route) => {
    if (route.label !== 'Donna') {
      return route;
    }
    const isReminderWorkflowEnabled = isFeatureEnabledSelector(
      featureFlags.get('flags'),
      'use-templates-from-workflow-service-reminder',
    );

    route.to = isReminderWorkflowEnabled ? '/settings/workflow' : '/settings/donna/reminders';
    return route;
  });

  return <RouterTabs routes={updatedRoutes} />;
};

SubTabs.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  featureFlags: PropTypes.instanceOf(Map).isRequired,
};

const mapStateToProps = ({ featureFlags }) => ({
  featureFlags,
});

const enhance = connect(mapStateToProps, null);

export default enhance(SubTabs);
