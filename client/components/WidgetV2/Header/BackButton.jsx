
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import Button from '../../library/Button';
import availabilityShape from '../../library/PropTypeShapes/availabilityShape';
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
 * Button that fires the back action.
 *
 * @param goBack
 * @returns {function(): *}
 */
const backButton = goBack => () => (
  <Button className={styles.backButton} onClick={goBack}>
    <svg xmlns="http://www.w3.org/2000/svg">
      <path d="M2.207 7.5l5.147 5.146a.5.5 0 1 1-.708.708l-6-6a.5.5 0 0 1 .01-.717l5.99-5.99a.5.5 0 0 1 .708.707L2.207 6.5H12a.5.5 0 1 1 0 1H2.207z" />
    </svg>
  </Button>
);

function BackButton(props) {
  return (
    <Router history={props.history}>
      <Switch>
        <Route
          exact
          path={pathBuilder('/book/reason')}
          component={backButton(props.goBack('./practitioner'))}
        />
        <Route
          exact
          path={pathBuilder('/book/date-and-time')}
          component={backButton(props.goBack('./reason'))}
        />
        <Route
          exact
          path={pathBuilder('/book/waitlist/select-date')}
          component={backButton(props.goBack('../date-and-time'))}
        />
        <Route exact path={pathBuilder('/signup')} component={backButton(props.goBack('./book'))} />
        <Route
          exact
          path={pathBuilder('/signup/confirm')}
          component={backButton(props.goBack('../book'))}
        />
        <Route exact path={pathBuilder('/login')} component={backButton(props.goBack('./book'))} />
        <Route
          exact
          path={pathBuilder('/book/review')}
          component={backButton(props.goBack('../book'))}
        />
        <Route
          exact
          path={pathBuilder('/book/wait')}
          component={backButton(props.goBack('../book'))}
        />
        <Route
          exact
          path={pathBuilder('/patient/add')}
          component={backButton(props.goBack('../book/review'))}
        />
        <Route
          path={pathBuilder('/patient/edit')}
          component={backButton(props.goBack('../../book/review'))}
        />
      </Switch>
    </Router>
  );
}

function mapStateToProps({ availabilities }) {
  return {
    selectedAvailability: availabilities.get('selectedAvailability'),
  };
}

export default connect(mapStateToProps, null)(BackButton);

BackButton.propTypes = {
  history: PropTypes.shape(historyShape),
  goBack: PropTypes.func.isRequired,
  selectedAvailability: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(availabilityShape)]),
};
