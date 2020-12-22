
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { isHub } from '../../../util/hub';
import PatientUser from '../../../entities/models/PatientUser';
import Practitioner from '../../../entities/models/Practitioners';
import { Card, Avatar, Icon, SContainer, SHeader, SBody, SFooter, Button } from '../../library';
import styles from './styles.scss';
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
    <Button border="blue" dense compact onClick={rejectRequest}>
      Reject
    </Button>
    <Button color="blue" dense compact className={styles.editButton} onClick={acceptRequest}>
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
      color="blue"
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

export default class RequestPopover extends Component {
  constructor(props) {
    super(props);

    this.state = { displayActions: false };

    this.toggleActionDisplay = this.toggleActionDisplay.bind(this);
  }

  toggleActionDisplay() {
    this.setState(prevState => ({ displayActions: !prevState.displayActions }));
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
    } = this.props;

    const { displayActions } = this.state;
    const appointmentDate = moment(request.startDate).format('dddd LL');
    const requestedAt = moment(request.createdAt).format('MMM D, hh:mm A');
    const age = patient.birthDate ? `, ${moment().diff(patient.birthDate, 'years')}` : '';

    return (
      <Card className={isMobile ? styles.cardMobile : styles.card} noBorder>
        {!isHub() &&
          (isMobile
            ? renderMobileHeader(this.props)
            : renderDesktopHeader({
                ...this.props,
                age,
              }))}
        {isMobile &&
          renderMobileSubHeader({
            ...this.props,
            age,
          })}
        <SContainer
          className={classNames({
            [styles.blurredHub]: displayActions && isHub(),
            [styles.blurred]: displayActions && !isHub(),
          })}
          onClick={displayActions && this.toggleActionDisplay}
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

            <Info
              patient={patient}
              insuranceCarrier={insuranceCarrier}
              insuranceMemberId={insuranceMemberId}
              insuranceGroupId={insuranceGroupId}
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
