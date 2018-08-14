
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment-timezone';
import { Grid, Row, Col, IconButton, DayPicker } from '../../../../library';
import * as Actions from '../../../../../actions/availabilities';
import { accountShape } from '../../../../library/PropTypeShapes';
import styles from './styles.scss';

function generateIsDisabledDay(currentDate, accountTimezone) {
  return date => moment.tz(date, accountTimezone).isBefore(moment.tz(currentDate, accountTimezone), 'day');
}

class MobileDayPicker extends Component {
  constructor(props) {
    super(props);

    this.oneDayBackward = this.oneDayBackward.bind(this);
    this.oneDayForward = this.oneDayForward.bind(this);
    this.setSelectedDate = this.setSelectedDate.bind(this);
  }

  oneDayBackward() {
    const newStartDate = moment
      .tz(this.props.selectedStartDate, this.props.account.timezone)
      .subtract(1, 'days')
      .toISOString();
    this.props.setIsFetching(true);
    this.props.setSelectedStartDate(newStartDate);
  }

  oneDayForward() {
    const newStartDate = moment
      .tz(this.props.selectedStartDate, this.props.account.timezone)
      .add(1, 'days')
      .toISOString();
    this.props.setIsFetching(true);
    this.props.setSelectedStartDate(newStartDate);
  }

  setSelectedDate(date) {
    this.props.setIsFetching(true);
    this.props.setSelectedStartDate(date);
  }

  render() {
    const { selectedStartDate, floorDate, account } = this.props;

    // TODO: do we need to do anything with this?
    const accountTimezone = account.timezone;
    const mDate = moment.tz(selectedStartDate, accountTimezone);
    const currentDate = moment(selectedStartDate).subtract(1, 'day').toISOString();
    const canGoBack = !generateIsDisabledDay(floorDate, accountTimezone)(currentDate);
    const isToday = mDate.isSame(moment().tz(accountTimezone), 'day');
    const isTomorrow = mDate.isSame(
      moment()
        .tz(accountTimezone)
        .add(1, 'day'),
      'day',
    );

    let dayString = mDate.format('ddd');
    if (isToday) {
      dayString = 'Today';
    } else if (isTomorrow) {
      dayString = 'Tomorrow';
    }

    const dateTarget = props => <div {...props}>{`${dayString}, ${mDate.format('MMM Do')}`}</div>;

    return (
      <Grid className={styles.wrapper}>
        <Row>
          <Col xs={1}>
            {canGoBack && (
              <IconButton
                className={styles.caretButton}
                icon="caret-left"
                iconType="solid"
                onClick={() => this.oneDayBackward()}
              />
            )}
          </Col>
          <Col xs={10} className={styles.date}>
            <DayPicker
              value={selectedStartDate}
              target="custom"
              TargetComponent={dateTarget}
              tipSize={0.01}
              onChange={this.setSelectedDate}
              timezone={accountTimezone}
              disabledDays={generateIsDisabledDay(floorDate, accountTimezone)}
            />
          </Col>
          <Col xs={1}>
            <IconButton
              className={styles.caretButton}
              icon="caret-right"
              iconType="solid"
              onClick={() => this.oneDayForward()}
            />
          </Col>
        </Row>
      </Grid>
    );
  }

  // TODO: change Left/Right Buttons to Button elements with Icons
  // TODO: break out the availabilities component into columns and lists
}

function mapStateToProps({ availabilities }) {
  const account = availabilities.get('account').toJS();
  return {
    selectedStartDate: availabilities.get('selectedStartDate'),
    floorDate: availabilities.get('floorDate'),
    account,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setSelectedStartDate: Actions.setSelectedStartDate,
      setIsFetching: Actions.setIsFetching,
    },
    dispatch,
  );
}

MobileDayPicker.propTypes = {
  selectedStartDate: PropTypes.string.isRequired,
  floorDate: PropTypes.string.isRequired,
  account: PropTypes.shape(accountShape).isRequired,
  setIsFetching: PropTypes.func.isRequired,
  setSelectedStartDate: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileDayPicker);
