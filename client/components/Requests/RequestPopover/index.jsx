
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Map } from 'immutable';
import classNames from 'classnames';
import { isHub } from '../../../util/hub';
import PatientUser from '../../../entities/models/PatientUser';
import Request from '../../../entities/models/Request';
import { Card, Avatar, Icon, SContainer, SHeader, SBody, SFooter, Button } from '../../library';
import { FormatPhoneNumber } from '../../library/util/Formatters';
import styles from './styles.scss';

const propTypes = {
  acceptRequest: PropTypes.func,
  closePopover: PropTypes.func,
  insuranceCarrier: PropTypes.string,
  insuranceMemberId: PropTypes.string,
  isMobile: PropTypes.bool,
  note: PropTypes.string,
  patient: PropTypes.instanceOf(PatientUser),
  practitioner: PropTypes.instanceOf(Map),
  rejectRequest: PropTypes.func,
  request: PropTypes.instanceOf(Request),
  requestingUser: PropTypes.instanceOf(PatientUser),
  service: PropTypes.string,
  time: PropTypes.string,
};

const renderDesktopHeader = ({ patient, closePopover }) => (
  <SHeader className={styles.header}>
    <Avatar user={patient} size="xs" />
    <div className={styles.header_text}>
      {patient.firstName} {patient.lastName}
    </div>
    <Button className={styles.closeIcon} onClick={closePopover}>
      <Icon icon="times" />
    </Button>
  </SHeader>
);

renderDesktopHeader.propTypes = propTypes;

const renderMobileHeader = ({ time, closePopover }) => (
  <SHeader className={styles.headerMobile}>
    <Button className={styles.closeIconMobile} onClick={closePopover}>
      <Icon icon="arrow-left" size={1.2} />
    </Button>
    <Icon icon="calendar" size={1.2} className={styles.calendarIcon} />
    <div className={styles.header_text}>{time}</div>
  </SHeader>
);

renderMobileHeader.propTypes = propTypes;

const renderMobileSubHeader = ({ patient }) => {
  const age = patient.birthDate ? `, ${moment().diff(patient.birthDate, 'years')}` : '';
  return (
    <div className={styles.subHeaderMobile}>
      <Avatar user={patient} size="xs" />
      <Button as={'div'} className={styles.subHeaderMobile_text}>
        {`${patient.firstName} ${patient.lastName}${age}`}
      </Button>
    </div>
  );
};

renderMobileSubHeader.propTypes = propTypes;

const renderDesktopFooter = ({ acceptRequest, rejectRequest }) => (
  <SFooter className={styles.footer}>
    <Button border="blue" dense compact onClick={rejectRequest}>
      Reject
    </Button>
    <Button color="blue" dense compact className={styles.editButton} onClick={acceptRequest}>
      Accept
    </Button>
  </SFooter>
);

renderDesktopFooter.propTypes = propTypes;

const renderMobileFooter = ({
  toggleActionDisplay,
  displayActions,
  rejectRequest,
  acceptRequest,
}) => (
  <SFooter
    className={classNames(styles.footerMobile, {
      [styles.footerMobile_displayActions]: displayActions,
    })}
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
      color="blue"
      dense
      compact
      rounded
      className={styles.actionButtonMobile}
      onClick={toggleActionDisplay}
    >
      <Icon icon="plus" />
    </Button>
    {displayActions && (
      <svg height="0">
        <filter id="blurred">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </svg>
    )}
  </SFooter>
);

renderMobileFooter.propTypes = {
  ...propTypes,
  toggleActionDisplay: PropTypes.func,
  displayActions: PropTypes.bool,
};

export default class RequestPopover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayActions: false,
    };

    this.toggleActionDisplay = this.toggleActionDisplay.bind(this);
  }

  toggleActionDisplay() {
    this.setState(prevState => ({
      displayActions: !prevState.displayActions,
    }));
  }

  render() {
    const {
      patient,
      request,
      time,
      service,
      insuranceCarrier,
      insuranceMemberId,
      note,
      requestingUser,
      isMobile,
    } = this.props;

    const { displayActions } = this.state;

    const appointmentDate = moment(request.startDate).format('dddd LL');
    const requestedAt = moment(request.createdAt).format('MMM D, hh:mm A');
    return (
      <Card className={isMobile ? styles.cardMobile : styles.card} noBorder>
        {!isHub() && (isMobile ? renderMobileHeader(this.props) : renderDesktopHeader(this.props))}
        {isMobile && renderMobileSubHeader(this.props)}
        <SContainer
          className={classNames({
            [styles.blurredHub]: displayActions && isHub(),
            [styles.blurred]: displayActions && !isHub(),
          })}
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

            {patient.phoneNumber || patient.email || insuranceCarrier ? (
              <div className={styles.container}>
                <div className={styles.subHeader}>Patient Info</div>

                <div className={styles.data}>
                  {patient.phoneNumber && <Icon icon="phone" size={0.9} type="solid" />}
                  <div className={styles.data_text}>
                    {patient.phoneNumber && patient.phoneNumber[0] === '+'
                      ? FormatPhoneNumber(patient.phoneNumber)
                      : patient.phoneNumber}
                  </div>
                </div>

                <div className={styles.data}>
                  {patient.email ? <Icon icon="envelope" size={0.9} type="solid" /> : null}
                  <div className={styles.data_text}>{patient.email}</div>
                </div>
                <div className={styles.multilineData}>
                  {insuranceCarrier && <Icon icon="medkit" size={0.9} type="solid" />}
                  <div className={styles.data_text}>
                    {insuranceCarrier || 'n/a'}
                    {insuranceMemberId && (
                      <span className={styles.subData}>
                        <br />
                        {insuranceMemberId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.container}>
                <div className={styles.subHeader}>Patient Info</div>
                <div className={styles.data}>n/a</div>
              </div>
            )}
            {note ? (
              <div className={styles.container}>
                <div className={styles.subHeader}>Note</div>
                <div className={styles.data}>
                  <div className={styles.data_note}>{note}</div>
                </div>
              </div>
            ) : null}

            <div className={styles.requestedAt}>
              {requestingUser ? (
                <div className={styles.requestedAt_diffUserContainer}>
                  <span className={styles.requestedAt_on}>Requested by:</span>
                  <span className={styles.requestedAt_byDiffUser}>
                    {requestingUser.get('firstName')} {requestingUser.get('lastName')}
                  </span>
                </div>
              ) : null}
              <span className={styles.requestedAt_on}> Requested on: {requestedAt} </span>
            </div>
          </SBody>
        </SContainer>
        {isMobile
          ? renderMobileFooter({
            toggleActionDisplay: this.toggleActionDisplay,
            displayActions,
            ...this.props,
          })
          : renderDesktopFooter(this.props)}
      </Card>
    );
  }
}

RequestPopover.propTypes = propTypes;
