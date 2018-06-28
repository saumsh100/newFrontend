
import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter as Router } from 'react-router-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { historyShape } from '../../library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

/**
 * Generates a valid url using the provided path.
 *
 * @param path
 * @returns {string}
 */
const pathBuilder = (path = '') => `/widgets/:accountId/app${path}`;

/**
 * Simple div displaying the route title
 *
 * @param title
 * @returns {function(): *}
 */
const titleDiv = title => () => <div className={styles.title}>{title}</div>;

function Title({ hasWaitList, history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route
          exact
          path={pathBuilder('/practitioner')}
          component={titleDiv('Select Practitioner')}
        />
        <Route
          exact
          path={pathBuilder('/book/practitioner')}
          component={titleDiv('Select Practitioner')}
        />
        <Route exact path={pathBuilder('/book/reason')} component={titleDiv('Select Reason')} />
        <Route
          exact
          path={pathBuilder('/book/date-and-time')}
          component={titleDiv('Select Date & Time')}
        />
        <Route
          exact
          path={pathBuilder('/book/waitlist/join')}
          component={titleDiv('Join Waitlist')}
        />
        <Route
          exact
          path={pathBuilder('/book/waitlist/select-dates')}
          component={titleDiv('Select Waitlist Dates')}
        />
        <Route
          exact
          path={pathBuilder('/book/waitlist/select-times')}
          component={titleDiv('Pick Best Time')}
        />
        <Route
          exact
          path={pathBuilder('/book/waitlist/remove-dates')}
          component={titleDiv('Remove Dates')}
        />
        <Route
          exact
          path={pathBuilder('/book/waitlist/days-unavailable')}
          component={titleDiv('Days Unavailable')}
        />
        <Route exact path={pathBuilder('/login')} component={titleDiv('Login')} />
        <Route exact path={pathBuilder('/reset')} component={titleDiv('Reset Password')} />
        <Route exact path={pathBuilder('/reset-success')} component={titleDiv('Reset Password')} />
        <Route exact path={pathBuilder('/signup')} component={titleDiv('Sign Up')} />
        <Route exact path={pathBuilder('/signup/confirm')} component={titleDiv('Confirm Signup')} />
        <Route
          exact
          path={pathBuilder('/book/patient-information')}
          component={titleDiv('Patient Information')}
        />
        <Route
          exact
          path={pathBuilder('/book/additional-information')}
          component={titleDiv('Additional Information')}
        />
        <Route exact path={pathBuilder('/book/review')} component={titleDiv('Review & Book')} />
        <Route exact path={pathBuilder('/patient/add')} component={titleDiv('Add New Patient')} />
        <Route path={pathBuilder('/patient/edit')} component={titleDiv('Edit Patient')} />
        <Route
          exact
          path={pathBuilder('/book/wait')}
          component={titleDiv(`${hasWaitList ? 'Edit' : 'Join'} Waitlist`)}
        />
      </Switch>
    </Router>
  );
}

Title.propTypes = {
  hasWaitList: PropTypes.bool.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
};

export default withRouter(Title);
