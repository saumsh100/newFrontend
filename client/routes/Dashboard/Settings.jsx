/* eslint-disable no-shadow */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Suspense } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import Loader from '../../components/Loader';
import Donna from '../../components/Settings/Donna';
import Practice from '../../components/Settings/Practice';
import Container from '../../containers/SettingsContainer';
import Workflows from '../../micro-front-ends/settings/workflow';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';
import Forms from '../../micro-front-ends/settings/forms';

const base = (path = '') => `/settings${path}`;
const practiceBase = (path = '') => base(`/practice${path}`);
const donnaBase = (path = '') => base(`/workflow${path}`);
const donnaOldBase = (path = '') => base(`/donna${path}`);

const Routes = {
  clinicGeneral: loadable(() => import('../../components/Settings/Practice/General')),
  clinicUsers: loadable(() => import('../../components/Settings/Practice/Users')),

  scheduleOfficeHours: loadable(() => import('../../components/Settings/Practice/OfficeHours')),
  scheduleOnlineBooking: loadable(() => import('../../components/Settings/Practice/OnlineBooking')),
  chairs: loadable(() => import('../../components/Settings/Practice/Chairs')),
  forms: loadable(() => import('../../components/Settings/Practice/Forms')),
  superAdmin: loadable(() => import('../../components/Settings/Practice/SuperAdmin')),

  reminders: loadable(() => import('../../components/Settings/Donna/Reminders')),
  recalls: loadable(() => import('../../components/Settings/Donna/Recalls')),
  reviews: loadable(() => import('../../components/Settings/Donna/Reviews')),

  reasons: loadable(() => import('../../components/Settings/Reasons')),
  practitioners: loadable(() => import('../../components/Settings/Practitioners')),
};

const PracticeContainer = (props) => (
  <Practice {...props}>
    <Switch>
      <Redirect exact from={practiceBase()} to={practiceBase('/general')} />
      <Route path={practiceBase('/general')} component={Routes.clinicGeneral} />
      <Route path={practiceBase('/users')} component={Routes.clinicUsers} />
      <Route path={practiceBase('/hours')} component={Routes.scheduleOfficeHours} />
      <Route path={practiceBase('/onlinebooking')} component={Routes.scheduleOnlineBooking} />
      <Route path={practiceBase('/chairs')} component={Routes.chairs} />
      <Route path={practiceBase('/superadmin')} component={Routes.superAdmin} />
    </Switch>
  </Practice>
);

const DonnaContainer = (props) => {
  const { isFeatureFlagOn } = props;
  const redirectFrom = isFeatureFlagOn ? donnaOldBase() : donnaBase();
  const redirectTo = isFeatureFlagOn ? donnaBase('/reminders') : donnaOldBase('/reminders');

  return (
    <Donna {...props}>
      <Switch>
        <Redirect exact from={redirectFrom} to={redirectTo} />
        <Route
          path={donnaOldBase('/reminders')}
          render={(props) => {
            return isFeatureFlagOn ? (
              <Redirect to={donnaBase('/reminders')} />
            ) : (
              <Routes.reminders {...props} />
            );
          }}
        />
        <Route path={donnaOldBase('/recalls')} component={Routes.recalls} />
        <Route path={donnaOldBase('/reviews')} component={Routes.reviews} />
        <Route path={donnaOldBase('/old-reminders')} component={Routes.reminders} />
      </Switch>
    </Donna>
  );
};

DonnaContainer.propTypes = {
  isFeatureFlagOn: PropTypes.bool.isRequired,
};

const Settings = ({
  useReminderWorkflowService,
  useFormsFromFormService,
  useReviewService,
  useRecallService,
}) => {
  const isFeatureFlagOn = useReminderWorkflowService || useReviewService || useRecallService;
  return (
    <DocumentTitle title="CareCru | Settings">
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route
            path={donnaBase()}
            render={(props) => {
              return isFeatureFlagOn ? (
                <Workflows {...props} />
              ) : (
                <Redirect to={donnaOldBase('/reminders')} />
              );
            }}
          />
          <Container>
            <Route path={practiceBase()} component={PracticeContainer} />
            <Route
              path={donnaOldBase()}
              render={(props) => <DonnaContainer {...props} isFeatureFlagOn={isFeatureFlagOn} />}
            />
            <Route path={base('/reasons')} component={Routes.reasons} />
            <Route path={base('/practitioners')} component={Routes.practitioners} />
            <Route
              path={base('/forms')}
              render={(props) =>
                !useFormsFromFormService ? <Routes.forms {...props} /> : <Forms {...props} />
              }
            />
            <Route exact path={base()} component={() => <Redirect to={practiceBase()} />} />
          </Container>
        </Switch>
      </Suspense>
    </DocumentTitle>
  );
};

function mapStateToProps({ featureFlags }) {
  const isDev = process.env.NODE_ENV === 'development';
  const useReminderWorkflowService = isDev
    ? true
    : isFeatureEnabledSelector(
        featureFlags.get('flags'),
        'use-templates-from-workflow-service-reminder',
      );
  const useReviewService = isDev
    ? false
    : isFeatureEnabledSelector(
        featureFlags.get('flags'),
        'use-templates-from-workflow-service-review',
      );
  const useRecallService = isDev
    ? true
    : isFeatureEnabledSelector(
        featureFlags.get('flags'),
        'use-templates-from-workflow-service-recall',
      );
  const useFormsFromFormService = isDev
    ? true
    : isFeatureEnabledSelector(featureFlags.get('flags'), 'use-forms-from-form-service');

  return {
    useReminderWorkflowService,
    useRecallService,
    useReviewService,
    useFormsFromFormService,
  };
}

Settings.propTypes = {
  useReminderWorkflowService: PropTypes.bool.isRequired,
  useRecallService: PropTypes.bool.isRequired,
  useReviewService: PropTypes.bool.isRequired,
  useFormsFromFormService: PropTypes.bool.isRequired,
};

const enhance = connect(mapStateToProps, null);

export default enhance(Settings);
