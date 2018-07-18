
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import classnames from 'classnames';
import Button from '../../library/Button';
import { historyShape } from '../../library/PropTypeShapes/routerShapes';
import { summaryTabSVG, bookingTabSVG } from '../SVGs';
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
        {bookingTabSVG}
        Booking
      </Button>
      <Button
        className={classnames(styles.headerTab, {
          [styles.active]: !isBooking,
        })}
        onClick={() => setIsBooking(false)}
      >
        {summaryTabSVG}
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
