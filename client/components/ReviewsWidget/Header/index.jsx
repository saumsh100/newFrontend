
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { closeBookingModal } from '../../../thunks/availabilities';
import { Avatar, IconButton } from '../../library';
import PatientUserMenu from './PatientUserMenu';
import styles from './styles.scss';

class Header extends Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    alert('Going Back');
  }

  render() {
    return (
      <div className={styles.headerContainer}>
        <IconButton
          icon="arrow-left"
          onClick={this.goBack}
          className={styles.closeButton}
        />
        <div className={styles.title}>
          Select Availability
        </div>
        <div className={styles.pullRight}>
          <IconButton
            icon="filter"
            onClick={this.props.closeBookingModal}
            className={styles.closeButton}
          />
          <IconButton
            icon="calendar"
            onClick={this.props.closeBookingModal}
            className={styles.calendarButton}
          />
          <PatientUserMenu user={{ firstName: 'Jack', lastName: 'Sharp' }} />
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    closeBookingModal,
  }, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(Header));
