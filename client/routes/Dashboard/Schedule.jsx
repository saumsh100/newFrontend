
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import ScheduleDayView from '../../components/Schedule/DayView';
import ScheduleContainer from '../../containers/ScheduleContainer';

const Schedule = () =>
  <ScheduleContainer>
    <DocumentTitle title="CareCru | Schedule">
      <Switch>
        <Redirect exact from="/schedule" to="/schedule/calendar" />
        <Route path="/schedule/calendar" component={ScheduleDayView} />
      </Switch>
    </DocumentTitle>
  </ScheduleContainer>;

export default Schedule;
