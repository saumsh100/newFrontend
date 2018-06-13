
import PropTypes from 'prop-types';
import React from 'react';
import { ConnectedRouter as Router } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
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

export default function Title(props) {
  return (
    <Router history={props.history}>
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
          component={titleDiv(`${props.hasWaitList ? 'Edit' : 'Join'} Waitlist`)}
        />
      </Switch>
    </Router>
  );
}

const location = {
  pathname: PropTypes.string,
  search: PropTypes.string,
  hash: PropTypes.string,
  state: PropTypes.string,
  key: PropTypes.string,
};

Title.propTypes = {
  hasWaitList: PropTypes.bool,
  history: PropTypes.shape({
    length: PropTypes.number,
    action: PropTypes.string,
    location: PropTypes.shape(location),
    index: PropTypes.number,
    entries: PropTypes.arrayOf(PropTypes.shape(location)),
    createHref: PropTypes.func,
    push: PropTypes.func,
    replace: PropTypes.func,
    go: PropTypes.func,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
    canGo: PropTypes.func,
    block: PropTypes.func,
    listen: PropTypes.func,
  }),
};
