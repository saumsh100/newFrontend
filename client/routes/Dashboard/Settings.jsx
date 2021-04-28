/* eslint-disable react/jsx-props-no-spreading */
import React, { lazy, Suspense } from 'react';
import DocumentTitle from 'react-document-title';
import { Redirect, Route, Switch } from 'react-router-dom';
import Loader from '../../components/Loader';
import Donna from '../../components/Settings/Donna';
import Practice from '../../components/Settings/Practice';
import Container from '../../containers/SettingsContainer';
import Workflows from '../../micro-front-ends/settings/workflow';

const base = (path = '') => `/settings${path}`;
const practiceBase = (path = '') => base(`/practice${path}`);
const donnaBase = (path = '') => base(`/workflow${path}`);
const donnaOldBase = (path = '') => base(`/donna${path}`);

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
      <Redirect exact from={donnaOldBase()} to={donnaBase('/reminders')} />
      <Route path={donnaOldBase('/reminders')} component={Routes.reminders} />
      <Route path={donnaOldBase('/recalls')} component={Routes.recalls} />
      <Route path={donnaOldBase('/reviews')} component={Routes.reviews} />
    </Switch>
  </Donna>
);

const Settings = () => {
  return (
    <DocumentTitle title="CareCru | Settings">
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path={donnaBase()} component={Workflows} />
          <Container>
            <Route path={practiceBase()} component={PracticeContainer} />
            <Route path={donnaOldBase()} component={DonnaContainer} />
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

export default Settings;
