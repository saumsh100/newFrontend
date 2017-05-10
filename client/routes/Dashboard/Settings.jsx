import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import Container from '../../containers/SettingsContainer';
import Clinic from '../../components/Settings/Clinic';
import Schedule from '../../components/Settings/Schedule';

import ClinicGeneral from '../../components/Settings/Clinic/General';
import ClinicUsers from '../../components/Settings/Clinic/Users';
import ScheduleOfficeHours from '../../components/Settings/Schedule/OfficeHours';
import Services from '../../components/Settings/Services';
import Practitioners from '../../components/Settings/Practitioners';

const base = (path = '') => `/settings${path}`;
const clinicBase = (path = '') => base(`/clinic${path}`);
const scheduleBase = (path = '') => base(`/schedule${path}`);

const ClinicContainer = props =>
  <Clinic {...props}>
    <Switch>
      <Redirect exact from={clinicBase()} to={clinicBase('/general')} />

      <Route path={clinicBase('/general')} component={ClinicGeneral} />
      <Route path={clinicBase('/users')} component={ClinicUsers} />
    </Switch>
  </Clinic>;

const ScheduleContainer = props =>
  <Schedule {...props}>
    <Switch>
      <Redirect exact from={scheduleBase()} to={scheduleBase('/hours')} />

      <Route path={scheduleBase('/hours')} component={ScheduleOfficeHours} />
    </Switch>
  </Schedule>;

const Settings = props =>
  <Container {...props}>
    <Switch>
      <Redirect exact from={base()} to={base('/clinic')} />

      <Route path={clinicBase()} component={ClinicContainer} />
      <Route path={scheduleBase()} component={ScheduleContainer} />
      <Route path={base('/services')} component={Services} />
      <Route path={base('/practitioners')} component={Practitioners} />
    </Switch>
  </Container>;

export default Settings;
