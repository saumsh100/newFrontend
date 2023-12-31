import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import loadable from '@loadable/component';
import ScheduleContainer from '../../containers/ScheduleContainer';

const Routes = {
  calendar: loadable(() => import('../../components/Schedule/DayView')),
};

const Schedule = () => (
  <ScheduleContainer>
    <DocumentTitle title="CareCru | Schedule">
      <Switch>
        <Redirect exact from="/schedule" to="/schedule/calendar" />
        <Route path="/schedule/calendar" component={Routes.calendar} />
      </Switch>
    </DocumentTitle>
  </ScheduleContainer>
);

export default Schedule;
