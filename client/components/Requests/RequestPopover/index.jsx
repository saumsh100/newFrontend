import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';
import PatientUser from '../../../entities/models/PatientUser';
import Practitioner from '../../../entities/models/Practitioners';
import {
  Card,
  Avatar,
  Icon,
  SContainer,
  SHeader,
  SBody,
  SFooter,
  StandardButton as Button,
  getFormattedDate,
  getTodaysDate,
} from '../../library';
import styles from './reskin-styles.scss';
import Info from './Info';

const renderDesktopHeader = ({ patient, closePopover, age }) => (
  <SHeader className={styles.header}>
    <Avatar user={patient} size="xs" />
    <div className={styles.header_text}>
      {patient.firstName} {patient.lastName}
      {age}
    </div>
    <Button className={styles.closeIcon} onClick={closePopover}>
      <Icon icon="times" />
    </Button>
  </SHeader>
);

renderDesktopHeader.propTypes = {
  closePopover: PropTypes.func.isRequired,
  patient: PropTypes.instanceOf(PatientUser).isRequired,
  age: PropTypes.string.isRequired,
};

const renderMobileHeader = ({ time, closePopover }) => (
  <SHeader className={styles.headerMobile}>
    <Button className={styles.closeIconMobile} onClick={closePopover}>
      <Icon icon="arrow-left" size={1.2} />
    </Button>
    <Icon icon="calendar" size={1.2} className={styles.calendarIcon} />
    <div className={styles.header_text}>{time}</div>
  </SHeader>
);

renderMobileHeader.propTypes = {
  closePopover: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired,
};

const renderMobileSubHeader = ({ patient, age }) => (
  <div className={styles.subHeaderMobile}>
    <Avatar user={patient} size="xs" />
    <div className={styles.subHeaderMobile_text}>
      {`${patient.firstName} ${patient.lastName}${age}`}
    </div>
  </div>
);

renderMobileSubHeader.propTypes = {
  patient: PropTypes.instanceOf(PatientUser).isRequired,
  age: PropTypes.string.isRequired,
};

const renderDesktopFooter = ({ acceptRequest, rejectRequest }) => (
  <SFooter className={styles.footer}>
    <Button dense variant="secondary" className={styles.RequestButton} onClick={rejectRequest}>
      Reject
    </Button>
    <Button dense className={styles.RequestButton} onClick={acceptRequest}>
      Accept
    </Button>
  </SFooter>
);

renderDesktopFooter.propTypes = {
  acceptRequest: PropTypes.func.isRequired,
  rejectRequest: PropTypes.func.isRequired,
};

const renderMobileFooter = ({
  toggleActionDisplay,
  displayActions,
  rejectRequest,
  acceptRequest,
}) => (
  <SFooter
    className={classNames(styles.footerMobile, { [styles.footerMobile_actions]: displayActions })}
  >
    {displayActions && (
      <Button className={styles.actionOverlayButtonMobile} onClick={acceptRequest}>
        <Icon icon="check" size={1.5} className={styles.actionOverlayButtonIconMobile} />
        <span>Accept</span>
      </Button>
    )}
    {displayActions && (
      <Button className={styles.actionOverlayButtonMobile} onClick={rejectRequest}>
        <Icon
          icon="times"
          style={{ padding: '7px 9px' }}
          size={1.5}
          className={styles.actionOverlayButtonIconMobile}
        />
        <span>Reject</span>
      </Button>
    )}
    <Button
      dense
      compact
      rounded
      className={styles.actionButtonMobile}
      onClick={toggleActionDisplay}
    >
      <Icon icon={displayActions ? 'minus' : 'plus'} />
    </Button>
  </SFooter>
);

renderMobileFooter.propTypes = {
  acceptRequest: PropTypes.func.isRequired,
  displayActions: PropTypes.bool.isRequired,
  rejectRequest: PropTypes.func.isRequired,
  toggleActionDisplay: PropTypes.func.isRequired,
};

class RequestPopover extends Component {
  constructor(props) {
    super(props);

    this.state = { displayActions: false };

    this.toggleActionDisplay = this.toggleActionDisplay.bind(this);
  }

  toggleActionDisplay() {
    this.setState((prevState) => ({ displayActions: !prevState.displayActions }));
  }

  render() {
    const {
      patient,
      practitioner,
      request,
      time,
      service,
      insuranceCarrier,
      insuranceMemberId,
      insuranceGroupId,
      note,
      requestingUser,
      isMobile,
      showButton,
      timezone,
    } = this.props;
    const preferedTimeRaw =
      request.availableTimes && request.availableTimes.size
        ? request.availableTimes.toArray()
        : request.availableTimes;
    const preferedDaySlot = request.preferences
      ? request.preferences.size
        ? Object.fromEntries(request.preferences)
        : request.preferences
      : '';
    const preferedDays = request.daysOfTheWeek
      ? request.daysOfTheWeek.size
        ? Object.fromEntries(request.daysOfTheWeek)
        : request.daysOfTheWeek
      : '';

    const getPreferedDay = (weekdays) => {
      const preferedDaysArray = [];
      if (weekdays) {
        if (
          weekdays.monday &&
          weekdays.tuesday &&
          weekdays.wednesday &&
          weekdays.thursday &&
          weekdays.friday
        ) {
          if (weekdays.saturday && weekdays.sunday) {
            preferedDaysArray.push('Anyday');
          } else {
            preferedDaysArray.push('Weekdays');
          }
        } else {
          for (const key in weekdays) {
            if (weekdays[key]) {
              const newKey = key.charAt(0).toUpperCase() + key.slice(1);
              preferedDaysArray.push(newKey.substr(0, 3));
            }
          }
        }
      }
      return preferedDaysArray.length === 0 ? '-' : preferedDaysArray.sort().join('; ').toString();
    };
    function waitlistTableTimeParser(dateValue) {
      if (dateValue) {
        const dateString = new Date(dateValue);
        let hours = dateString.getHours();
        let minutes = dateString.getMinutes();

        const ampm = hours >= 12 ? 'pm' : 'am';
        hours %= 12;
        hours = hours || 12;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        const strTime = `${hours}:${minutes} ${ampm}`;
        return strTime;
      }
      return '-';
    }

    const calculateTimeDifference = (date1, date2) => {
      const time1 = moment(moment(new Date(date1)).format('YYYY-MM-DD HH:mm:ss'));
      const time2 = moment(moment(new Date(date2)).format('YYYY-MM-DD HH:mm:ss'));
      return time2.diff(time1, 'minutes');
    };

    const calculateTimeRange = (first, availableTimes) => {
      if (!availableTimes || !availableTimes.length) return '-';

      if (availableTimes.length === 30) {
        return 'Anytime';
      }

      let rangeLast;
      availableTimes = availableTimes.sort((date1, date2) => new Date(date1) - new Date(date2));
      let timeStr = waitlistTableTimeParser(availableTimes[0]);

      for (let i = 0; i < availableTimes.length - 1; i++) {
        const timeDiff = calculateTimeDifference(availableTimes[i], availableTimes[i + 1]);
        if (timeDiff <= 60) {
          rangeLast = availableTimes[i + 1];
        } else {
          if (rangeLast && rangeLast.length > 0) {
            timeStr = `${timeStr}-${waitlistTableTimeParser(rangeLast)};`;
            rangeLast = '';
          } else {
            timeStr += ';';
          }
          timeStr += waitlistTableTimeParser(availableTimes[i + 1]);
        }
        if (i + 1 === availableTimes.length - 1 && rangeLast) {
          timeStr = `${timeStr}-${waitlistTableTimeParser(rangeLast)}`;
        }
      }
      return timeStr;
    };

    const getPreferedTime = (preferedTime, preferedDay) => {
      if (preferedDay.mornings && !preferedDay.evenings && !preferedDay.afternoons) {
        return 'Morning (7:00am -11:30am)';
      }
      if (!preferedDay.mornings && preferedDay.evenings && !preferedDay.afternoons) {
        return 'Evening (6:00am -9:30pm)';
      }
      if (!preferedDay.mornings && !preferedDay.evenings && preferedDay.afternoons) {
        return 'Afternoon (12:00pm -5:30pm)';
      }
      if (preferedTime && preferedTime.length > 0) {
        return calculateTimeRange('', preferedTime);
      }
      return '-';
    };

    const { displayActions } = this.state;
    const appointmentDate = getFormattedDate(request.startDate, 'dddd LL', timezone);
    const requestedAt = getFormattedDate(request.createdAt, 'MMM D, hh:mm A', timezone);
    const age = patient.birthDate
      ? `, ${getTodaysDate(timezone).diff(patient.birthDate, 'years')}`
      : '';

    return (
      <Card className={isMobile ? styles.cardMobile : styles.card} noBorder>
        {isMobile
          ? renderMobileHeader(this.props)
          : renderDesktopHeader({
            ...this.props,
            age,
          })}
        {isMobile &&
          renderMobileSubHeader({
            ...this.props,
            age,
          })}
        <SContainer
          className={classNames({
            [styles.blurredHub]: displayActions,
            [styles.blurred]: displayActions,
          })}
          onClick={displayActions && this.toggleActionDisplay}
          onScroll={(e) => {
            e.stopPropagation();
          }}
        >
          <SBody className={isMobile ? styles.bodyMobile : styles.body}>
            <div className={styles.container}>
              <div className={styles.subHeader}>Date</div>
              <div className={styles.data}>{appointmentDate}</div>
            </div>

            <div className={styles.container}>
              <div className={styles.subHeader}>Time</div>
              <div className={styles.data}>{time}</div>
            </div>

            <div className={styles.container}>
              <div className={styles.subHeader}>Appointment Type</div>
              <div className={styles.data}>{service}</div>
            </div>

            <div className={styles.container}>
              <div className={styles.subHeader}>Practitioner</div>
              <div className={styles.data}>
                {practitioner ? practitioner.getPrettyName() : 'No Preference'}
              </div>
            </div>
            {request.onWaitlist && (
              <div className={styles.container}>
                <div className={styles.subHeader}>Waitlist</div>

                <div className={styles.data}>
                  <Icon icon="calendar-alt" type="solid" className={styles.waitlistDataIcon} />
                  <div className={styles.data_text}>{getPreferedDay(preferedDays)}</div>
                </div>
                <div className={styles.data}>
                  <Icon icon="clock" type="solid" className={styles.waitlistDataIcon} />
                  <div className={styles.data_text}>
                    {getPreferedTime(preferedTimeRaw, preferedDaySlot)}
                  </div>
                </div>
              </div>
            )}

            <Info
              patient={patient}
              insuranceCarrier={insuranceCarrier}
              insuranceMemberId={insuranceMemberId}
              insuranceGroupId={insuranceGroupId}
              timezone={timezone}
              title="Patient Info"
            />

            {note && (
              <div className={styles.container}>
                <div className={styles.subHeader}>Note</div>
                <div className={styles.data}>
                  <div className={styles.data_note}>{note}</div>
                </div>
              </div>
            )}

            {requestingUser && (
              <div className={styles.container}>
                <div className={styles.subHeader}>Requested By</div>
                <div className={styles.data}>
                  {requestingUser.get('firstName')} {requestingUser.get('lastName')}
                </div>
              </div>
            )}

            {requestingUser && (
              <Info
                requestingUser={requestingUser}
                insuranceCarrier={insuranceCarrier}
                insuranceMemberId={insuranceMemberId}
                insuranceGroupId={insuranceGroupId}
                title="Requester Info"
              />
            )}

            <div className={styles.requestedAt}>
              <span className={styles.requestedAt_on}> Requested on: {requestedAt} </span>
            </div>
          </SBody>
        </SContainer>
        {displayActions && (
          <svg height="0">
            <filter id="blurred">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </svg>
        )}
        {isMobile && showButton
          ? renderMobileFooter({
            toggleActionDisplay: this.toggleActionDisplay,
            displayActions,
            ...this.props,
          })
          : showButton && renderDesktopFooter(this.props)}
      </Card>
    );
  }
}

RequestPopover.propTypes = {
  insuranceCarrier: PropTypes.string,
  insuranceMemberId: PropTypes.string,
  insuranceGroupId: PropTypes.string,
  isMobile: PropTypes.bool,
  note: PropTypes.string,
  practitioner: PropTypes.instanceOf(Practitioner),
  // Not forcing instanceOf(Model) so that components not utilizing
  // entities reducers can use this component
  patient: PropTypes.objectOf(PropTypes.any).isRequired,
  request: PropTypes.objectOf(PropTypes.any).isRequired,
  requestingUser: PropTypes.objectOf(PropTypes.any),
  service: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  showButton: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
};

RequestPopover.defaultProps = {
  insuranceCarrier: null,
  insuranceMemberId: null,
  insuranceGroupId: null,
  isMobile: false,
  practitioner: null,
  note: null,
  requestingUser: null,
  showButton: true,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps, null)(RequestPopover);
