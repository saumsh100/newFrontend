
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import LazyRoute from '../LazyRoute';

import Container from '../../containers/SettingsContainer';
import Clinic from '../../components/Settings/Clinic';
import Schedule from '../../components/Settings/Schedule';
import Communications from '../../components/Settings/Communications';

const base = (path = '') => `/settings${path}`;
const clinicBase = (path = '') => base(`/clinic${path}`);
const scheduleBase = (path = '') => base(`/schedule${path}`);
const commsBase = (path = '') => base(`/communications${path}`);

const Routes = {
  clinicGeneral: LazyRoute(() => import('../../components/Settings/Clinic/General'), true),
  clinicUsers: LazyRoute(() => import('../../components/Settings/Clinic/Users'), true),

  scheduleOfficeHours: LazyRoute(() => import('../../components/Settings/Schedule/OfficeHours'), true),
  scheduleOnlineBooking: LazyRoute(() => import('../../components/Settings/Schedule/OnlineBooking'), true),
  chairs: LazyRoute(() => import('../../components/Settings/Schedule/Chairs'), true),

  reminders: LazyRoute(() => import('../../components/Settings/Communications/Reminders'), true),
  recalls: LazyRoute(() => import('../../components/Settings/Communications/Recalls'), true),
  reviews: LazyRoute(() => import('../../components/Settings/Communications/Reviews'), true),

  services: LazyRoute(() => import('../../components/Settings/Services'), true),
  practitioners: LazyRoute(() => import('../../components/Settings/Practitioners'), true),
}

const ClinicContainer = props =>
  <Clinic {...props}>
    <Switch>
      <Redirect exact from={clinicBase()} to={clinicBase('/general')} />
      <Route path={clinicBase('/general')} component={Routes.clinicGeneral} />
      <Route path={clinicBase('/users')} component={Routes.clinicUsers} />
    </Switch>
  </Clinic>;

const ScheduleContainer = props =>
  <Schedule {...props}>
    <Switch>
      <Redirect exact from={scheduleBase()} to={scheduleBase('/hours')} />
      <Route path={scheduleBase('/hours')} component={Routes.scheduleOfficeHours} />
      <Route path={scheduleBase('/onlinebooking')} component={Routes.scheduleOnlineBooking} />
      <Route path={scheduleBase('/chairs')} component={Routes.chairs} />
    </Switch>
  </Schedule>;

const CommunicationsContainer = props =>
  <Communications {...props}>
    <Switch>
      <Redirect exact from={commsBase()} to={commsBase('/reminders')} />
      <Route path={commsBase('/reminders')} component={Routes.reminders} />
      <Route path={commsBase('/recalls')} component={Routes.recalls} />
      <Route path={commsBase('/reviews')} component={Routes.reviews} />
    </Switch>
  </Communications>;

const Settings = props =>
  <Container {...props}>
    <DocumentTitle title="CareCru | Settings">
      <Switch>
        <Redirect exact from={base()} to={base('/clinic')} />
        <Route path={clinicBase()} component={ClinicContainer} />
        <Route path={scheduleBase()} component={ScheduleContainer} />
        <Route path={commsBase()} component={CommunicationsContainer} />
        <Route path={base('/services')} component={Routes.services} />
        <Route path={base('/practitioners')} component={Routes.practitioners} />
      </Switch>
    </DocumentTitle>
  </Container>;

export default Settings;
