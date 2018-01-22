
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import 'moment-timezone';
import classNames from 'classnames';
import {
  Grid,
  Row,
  Col,
  IconButton,
  Button,
  DayPicker,
} from '../../../../library';
import * as Actions from '../../../../../actions/availabilities';
import styles from './styles.scss';

function isDisabledDay(date) {
  return moment(date).isBefore(moment()) && !moment().isSame(date, 'day');
}

class MobileDayPicker extends Component {
  constructor(props) {
    super(props);

    this.oneDayBackward = this.oneDayBackward.bind(this);
    this.oneDayForward = this.oneDayForward.bind(this);
    this.setSelectedDate = this.setSelectedDate.bind(this);
  }

  oneDayBackward() {
    const newStartDate = moment(this.props.selectedStartDate).subtract(1, 'days').toISOString();
    this.props.setIsFetching(true);
    this.props.setSelectedStartDate(newStartDate);
  }

  oneDayForward() {
    const newStartDate = moment(this.props.selectedStartDate).add(1, 'days').toISOString();
    this.props.setIsFetching(true);
    this.props.setSelectedStartDate(newStartDate);
  }

  setSelectedDate(date) {
    this.props.setIsFetching(true);
    this.props.setSelectedStartDate(date);
  }

  render() {
    const {
      selectedStartDate,
      account,
    } = this.props;

    // TODO: do we need to do anything with this?
    const accountTimezone = account.timezone;

    const mDate = moment(selectedStartDate);
    const canGoBack = !isDisabledDay(moment(selectedStartDate).subtract(1, 'day'));
    const isToday = mDate.isSame(moment(), 'day');
    const isTomorrow = mDate.isSame(moment().add(1, 'day'), 'day');

    let dayString = mDate.format('ddd');
    if (isToday) {
      dayString = 'Today';
    } else if (isTomorrow) {
      dayString = 'Tomorrow';
    }

    const dateTarget = (props) => (
      <div
        {...props}
      >
        {`${dayString}, ${mDate.format('MMM Do')}`}
      </div>
    );

    return (
      <Grid className={styles.wrapper}>
        <Row>
          <Col xs={1}>
            {canGoBack ?
              <IconButton
                className={styles.caretButton}
                icon="caret-left"
                iconType="solid"
                onClick={() => this.oneDayBackward()}
              /> : null}
          </Col>
          <Col xs={10} className={styles.date}>
            <DayPicker
              value={selectedStartDate}
              target="custom"
              TargetComponent={dateTarget}
              tipSize={0.01}
              onChange={this.setSelectedDate}
              timezone={accountTimezone}
              disabledDays={isDisabledDay}
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

MobileDayPicker.propTypes = {
  selectedStartDate: PropTypes.string.isRequired,
  account: PropTypes.object,
  setSelectedStartDate: PropTypes.func.isRequired,
};

function mapStateToProps({ availabilities }) {
  const account = availabilities.get('account').toJS();
  return {
    selectedStartDate: availabilities.get('selectedStartDate'),
    account,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setSelectedStartDate: Actions.setSelectedStartDate,
    setIsFetching: Actions.setIsFetching,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileDayPicker);
