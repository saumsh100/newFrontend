
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import LazyRoute from '../LazyRoute';

import Container from '../../containers/SettingsContainer';
import Practice from '../../components/Settings/Practice';
import Donna from '../../components/Settings/Donna';

const base = (path = '') => `/settings${path}`;
const practiceBase = (path = '') => base(`/practice${path}`);
const donnaBase = (path = '') => base(`/donna${path}`);

const Routes = {
  clinicGeneral: LazyRoute(
    () => import('../../components/Settings/Practice/General'),
    true,
  ),
  clinicUsers: LazyRoute(
    () => import('../../components/Settings/Practice/Users'),
    true,
  ),

  scheduleOfficeHours: LazyRoute(
    () => import('../../components/Settings/Practice/OfficeHours'),
    true,
  ),
  scheduleOnlineBooking: LazyRoute(
    () => import('../../components/Settings/Practice/OnlineBooking'),
    true,
  ),
  chairs: LazyRoute(
    () => import('../../components/Settings/Practice/Chairs'),
    true,
  ),
  superAdmin: LazyRoute(
    () => import('../../components/Settings/Practice/SuperAdmin'),
    true,
  ),

  reminders: LazyRoute(
    () => import('../../components/Settings/Donna/Reminders'),
    true,
  ),
  recalls: LazyRoute(
    () => import('../../components/Settings/Donna/Recalls'),
    true,
  ),
  reviews: LazyRoute(
    () => import('../../components/Settings/Donna/Reviews'),
    true,
  ),

  reasons: LazyRoute(() => import('../../components/Settings/Reasons'), true),
  practitioners: LazyRoute(
    () => import('../../components/Settings/Practitioners'),
    true,
  ),
};

const PracticeContainer = props => (
  <Practice {...props}>
    <Switch>
      <Redirect exact from={practiceBase()} to={practiceBase('/general')} />
      <Route path={practiceBase('/general')} component={Routes.clinicGeneral} />
      <Route path={practiceBase('/users')} component={Routes.clinicUsers} />
      <Route
        path={practiceBase('/hours')}
        component={Routes.scheduleOfficeHours}
      />
      <Route
        path={practiceBase('/onlinebooking')}
        component={Routes.scheduleOnlineBooking}
      />
      <Route path={practiceBase('/chairs')} component={Routes.chairs} />
      <Route path={practiceBase('/superadmin')} component={Routes.superAdmin} />
    </Switch>
  </Practice>
);

const DonnaContainer = props => (
  <Donna {...props}>
    <Switch>
      <Redirect exact from={donnaBase()} to={donnaBase('/reminders')} />
      <Route path={donnaBase('/reminders')} component={Routes.reminders} />
      <Route path={donnaBase('/recalls')} component={Routes.recalls} />
      <Route path={donnaBase('/reviews')} component={Routes.reviews} />
    </Switch>
  </Donna>
);

const Settings = props => (
  <Container {...props}>
    <DocumentTitle title="CareCru | Settings">
      <Switch>
        <Redirect exact from={base()} to={base('/practice')} />
        <Route path={practiceBase()} component={PracticeContainer} />
        <Route path={donnaBase()} component={DonnaContainer} />
        <Route path={base('/reasons')} component={Routes.reasons} />
        <Route path={base('/practitioners')} component={Routes.practitioners} />
      </Switch>
    </DocumentTitle>
  </Container>
);

export default Settings;
