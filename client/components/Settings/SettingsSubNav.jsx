import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import find from 'lodash/find';
import { RouterList } from '../library';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';

function SettingsSubNav({ location, className, users, featureFlags, ...props }) {
  const { useReminderWorkflowService, useRecallService, useReviewService } = props;

  const PATHS = {
    '/settings/practice': [
      {
        to: '/settings/practice/general',
        label: 'General',
      },
      {
        to: '/settings/practice/users',
        label: 'Users',
      },
      {
        to: '/settings/practice/hours',
        label: 'Office Hours',
      },
      {
        to: '/settings/practice/onlinebooking',
        label: 'Online Booking',
      },
      {
        to: '/settings/practice/chairs',
        label: 'Chairs',
      },
      {
        to: '/settings/practice/superadmin',
        label: 'Super Admin',
        adminOnly: true,
      },
    ],

    '/settings/donna': [
      {
        to: useReminderWorkflowService
          ? '/settings/workflow/reminders'
          : '/settings/donna/reminders',
        label: 'Reminders',
        icon: 'clock',
      },
      {
        to: useRecallService ? '/settings/workflow/recalls' : '/settings/donna/recalls',
        label: 'Recalls',
      },
      {
        to: useReviewService ? '/settings/workflow/reviews' : '/settings/donna/reviews',
        label: 'Reviews',
      },
    ],

    '/settings/reasons': [
      {
        to: '/settings/reasons/reasonslist',
        label: 'Reasons List',
      },
    ],

    '/settings/practitioners': [
      {
        to: '/settings/practitioners/practitionerslist',
        label: 'Practitioners List',
      },
    ],
  };

  if (useReminderWorkflowService) {
    PATHS['/settings/donna'].splice(1, 0, {
      to: '/settings/workflow/virtual-waiting-room',
      label: 'Virtual Waiting Room',
    });

    PATHS['/settings/donna'].push({
      to: '/settings/workflow/admin/migration',
      label: 'Super Admin',
    });
  }

  const routes = find(PATHS, (route, key) => location.pathname.indexOf(key) === 0);
  const { flags } = featureFlags.toJS();

  // Workaround for redirects
  return routes ? (
    <RouterList
      location={location}
      routes={routes}
      className={className}
      users={users}
      featureFlags={flags}
    />
  ) : null;
}

SettingsSubNav.propTypes = {
  className: PropTypes.string,
  location: PropTypes.objectOf(PropTypes.string).isRequired,
  users: PropTypes.instanceOf(Map).isRequired,
  featureFlags: PropTypes.instanceOf(Map).isRequired,
  useReminderWorkflowService: PropTypes.bool.isRequired,
  useRecallService: PropTypes.bool.isRequired,
  useReviewService: PropTypes.bool.isRequired,
};

SettingsSubNav.defaultProps = {
  className: '',
};

function mapStateToProps({ featureFlags }) {
  const useReminderWorkflowService = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'use-templates-from-workflow-service-reminder',
  );
  const useReviewService = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'use-templates-from-workflow-service-review',
  );
  const useRecallService = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'use-templates-from-workflow-service-recall',
  );

  return {
    featureFlags,
    useReminderWorkflowService,
    useRecallService,
    useReviewService,
  };
}

const enhance = connect(mapStateToProps, null);

export default enhance(SettingsSubNav);
