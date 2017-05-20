
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import ScheduleDayView from '../../components/Schedule/DayViewPrevious';
import ScheduleContainer from '../../containers/ScheduleContainer';

const Schedule = () =>
  <ScheduleContainer>
    <Switch>
      <Redirect exact from="/schedule" to="/schedule/calendar" />
      <Route path="/schedule/calendar" component={ScheduleDayView} />
    </Switch>
  </ScheduleContainer>;

export default Schedule;
