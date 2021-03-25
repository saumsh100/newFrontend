/* eslint-disable react/jsx-props-no-spreading */

import PropTypes from 'prop-types';
import React, { lazy, Suspense } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import Loader from '../../components/Loader';
import Donna from '../../components/Settings/Donna';
import Practice from '../../components/Settings/Practice';
import Container from '../../containers/SettingsContainer';
import Workflows from '../../micro-front-ends/settings/workflow';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';

const base = (path = '') => `/settings${path}`;
const practiceBase = (path = '') => base(`/practice${path}`);
const donnaBase = (path = '') => base(`/donna${path}`);

const Routes = {
  clinicGeneral: lazy(() => import('../../components/Settings/Practice/General')),
  clinicUsers: lazy(() => import('../../components/Settings/Practice/Users')),

  scheduleOfficeHours: lazy(() => import('../../components/Settings/Practice/OfficeHours')),
  scheduleOnlineBooking: lazy(() => import('../../components/Settings/Practice/OnlineBooking')),
  chairs: lazy(() => import('../../components/Settings/Practice/Chairs')),
  forms: lazy(() => import('../../components/Settings/Practice/Forms')),
  superAdmin: lazy(() => import('../../components/Settings/Practice/SuperAdmin')),

  reminders: lazy(() => import('../../components/Settings/Donna/Reminders')),
  recalls: lazy(() => import('../../components/Settings/Donna/Recalls')),
  reviews: lazy(() => import('../../components/Settings/Donna/Reviews')),

  reasons: lazy(() => import('../../components/Settings/Reasons')),
  practitioners: lazy(() => import('../../components/Settings/Practitioners')),
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

const DonnaContainer = (props) => (
  <Donna {...props}>
    <Switch>
      <Redirect exact from={donnaBase()} to={donnaBase('/reminders')} />
      <Route path={donnaBase('/reminders')} component={Routes.reminders} />
      <Route path={donnaBase('/recalls')} component={Routes.recalls} />
      <Route path={donnaBase('/reviews')} component={Routes.reviews} />
    </Switch>
  </Donna>
);

const Settings = (props) => {
  const { useWorkflowService, ...rest } = props;

  return (
    <DocumentTitle title="CareCru | Settings">
      <Suspense fallback={<Loader />}>
        <Switch>
          {useWorkflowService && <Route path={donnaBase()} component={Workflows} />}
          <Container {...rest}>
            <Route path={practiceBase()} component={PracticeContainer} />
            {!useWorkflowService && <Route path={donnaBase()} component={DonnaContainer} />}
            <Route path={base('/reasons')} component={Routes.reasons} />
            <Route path={base('/practitioners')} component={Routes.practitioners} />
            <Route path={base('/forms')} component={Routes.forms} />
            <Route exact path={base()} component={() => <Redirect to={practiceBase()} />} />
          </Container>
        </Switch>
      </Suspense>
    </DocumentTitle>
  );
};

Settings.propTypes = {
  useWorkflowService: PropTypes.bool.isRequired,
};

function mapStateToProps({ featureFlags }) {
  const useWorkflowService = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'use-templates-from-workflow-service',
  );

  return {
    useWorkflowService,
  };
}

const enhance = connect(mapStateToProps);

export default enhance(Settings);
