
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import { /*BrowserRouter as Router, */Redirect, Route, Switch, withRouter } from 'react-router-dom';
import moment from 'moment';
import { closeBookingModal } from '../../../thunks/availabilities';
import { setSelectedStartDate } from '../../../actions/availabilities';
import { Avatar, IconButton, DayPicker } from '../../library';
import PatientUserMenu from './PatientUserMenu';
import styles from './styles.scss';

const b = (path = '') => `/widgets/:accountId/app${path}`;

const map = {
  '/book': 'Availabilities Page',
  '/signup': 'Sign Up Page',
  '/login': 'Login Page',
};

function isDisabledDay(date) {
  return moment(date).isBefore(moment()) && !moment().isSame(date, 'day');
}

class Header extends Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack(path) {
    return () => this.props.history.push(path);
  }

  render() {
    const {
      isAuth,
      patientUser,
      hasWaitList,
      selectedStartDate,
      account,
    } = this.props;

    const backButton = path => () => (
      <IconButton
        icon="arrow-left"
        onClick={this.goBack(path)}
        className={styles.backButton}
      />
    );

    const titleDiv = title => () => (
      <div className={styles.title}>
        {title}
      </div>
    );

    const accountTimezone = account.get('timezone');

    return (
      <div className={styles.headerContainer}>
        {/* Back Button */}
        <Router history={this.props.history}>
          <div className={styles.backButtonWrapper}>
            <Route exact path={b('/signup')} component={backButton('./book')} />
            <Route exact path={b('/signup/confirm')} component={backButton('../book')} />
            <Route exact path={b('/login')} component={backButton('./book')} />
            <Route exact path={b('/book/review')} component={backButton('../book')} />
            <Route exact path={b('/book/wait')} component={backButton('../book')} />
          </div>
        </Router>
        {/* Title Div */}
        <Router history={this.props.history}>
          <div>
            <Route exact path={b('/book')} component={titleDiv('Select Availability')} />
            <Route exact path={b('/book/review')} component={titleDiv('Review & Book')} />
            <Route exact path={b('/book/wait')} component={titleDiv(`${hasWaitList ? 'Edit' : 'Join'} Waitlist`)} />
          </div>
        </Router>
        <div className={styles.pullRight}>
          <Router history={this.props.history}>
            <div>
              <Route exact path={b('/book')} component={() => (
                <div>
                  {/*<IconButton
                    icon="filter"
                    onClick={this.props.closeBookingModal}
                    className={styles.iconButton}
                  />*/}
                  <DayPicker
                    target="icon"
                    value={selectedStartDate}
                    onChange={value => this.props.setSelectedStartDate(value)}
                    tipSize={0.01}
                    timezone={accountTimezone}
                    disabledDays={isDisabledDay}
                    iconClassName={styles.calendarButton}
                  />
                </div>
              )} />
            </div>
          </Router>
          {isAuth ?
            <PatientUserMenu user={patientUser} />
          : null}
          <IconButton
            icon="close"
            onClick={this.props.closeBookingModal}
            className={styles.closeButton}
          />
        </div>
      </div>
    );
  }
}

Header.propTypes = {};

function mapStateToProps({ auth, availabilities }) {
  return {
    patientUser: auth.get('patientUser'),
    isAuth: auth.get('isAuthenticated'),
    hasWaitList: availabilities.get('hasWaitList'),
    selectedStartDate: availabilities.get('selectedStartDate'),
    account: availabilities.get('account'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    closeBookingModal,
    setSelectedStartDate,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
