
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import classnames from 'classnames';
import Button from '../../library/Button';
import { historyShape } from '../../library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

/**
 * Generates a valid url using the provided path.
 *
 * @param path
 * @returns {string}
 */
const pathBuilder = (path = '') => `/widgets/:accountId/app${path}`;

function Tabs({ history, isBooking, setIsBooking }) {
  const contentTabs = () => () => (
    <div className={styles.headerTabs}>
      <Button
        className={classnames(styles.headerTab, { [styles.active]: isBooking })}
        onClick={() => setIsBooking(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg">
          <path d="M0 2.5h2.5V0H0v2.5zM3.75 10h2.5V7.5h-2.5V10zM0 10h2.5V7.5H0V10zm0-3.75h2.5v-2.5H0v2.5zm3.75 0h2.5v-2.5h-2.5v2.5zM7.5 0v2.5H10V0H7.5zM3.75 2.5h2.5V0h-2.5v2.5zM7.5 6.25H10v-2.5H7.5v2.5zm0 3.75H10V7.5H7.5V10z" />
        </svg>
        Booking
      </Button>
      <Button
        className={classnames(styles.headerTab, {
          [styles.active]: !isBooking,
        })}
        onClick={() => setIsBooking(false)}
      >
        <svg xmlns="http://www.w3.org/2000/svg">
          <path d="M5 5A2.5 2.5 0 1 0 5.001.001 2.5 2.5 0 0 0 5 5zm0 1.25c-1.669 0-5 .838-5 2.5V10h10V8.75c0-1.662-3.331-2.5-5-2.5z" />
        </svg>
        Summary
      </Button>
    </div>
  );

  return (
    <Router history={history}>
      <Switch>
        <Route exact path={pathBuilder('/book/practitioner')} component={contentTabs()} />
        <Route exact path={pathBuilder('/book/reason')} component={contentTabs()} />
        <Route exact path={pathBuilder('/book/date-and-time')} component={contentTabs()} />
        <Route exact path={pathBuilder('/book/waitlist/select-dates')} component={contentTabs()} />
        <Route exact path={pathBuilder('/book/waitlist/select-times')} component={contentTabs()} />
        <Route exact path={pathBuilder('/signup/confirm')} component={contentTabs()} />
        <Route exact path={pathBuilder('/book/patient-information')} component={contentTabs()} />
        <Route exact path={pathBuilder('/book/additional-information')} component={contentTabs()} />
        <Route exact path={pathBuilder('/book/wait')} component={contentTabs()} />
        <Route exact path={pathBuilder('/patient/add')} component={contentTabs()} />
        <Route path={pathBuilder('/patient/edit')} component={contentTabs()} />
      </Switch>
    </Router>
  );
}

function mapStateToProps({ availabilities }) {
  return {
    selectedAvailability: availabilities.get('selectedAvailability'),
  };
}

export default connect(mapStateToProps, null)(Tabs);

Tabs.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  isBooking: PropTypes.bool.isRequired,
  setIsBooking: PropTypes.func.isRequired,
};
