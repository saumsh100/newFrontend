
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { formatPhoneNumber } from '@carecru/isomorphic';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Card, Avatar, Icon, Grid, Row, Col, Button, getFormattedDate } from '../../../library';
import InfoDump from '../../Shared/InfoDump';
import HygieneData from '../../Shared/HygieneColumn';
import RecallData from '../../Shared/RecallColumn';
import { isResponsive } from '../../../../util/hub';
import { accountShape } from '../../../library/PropTypeShapes';
import PatientModel from '../../../../entities/models/Patient';
import ActionsDropdown from '../ActionsDropdown';
import ui from '../../../../ui-kit.scss';
import styles from './styles.scss';

const bgImgs = [
  'banner-01.png',
  'banner-02.png',
  'banner-03.png',
  'banner-04.png',
  'banner-05.png',
];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomNum = getRandomIntInclusive(0, 4);

function TopDisplay(props) {
  const {
    patient,
    wasStatsFetched,
    patientStats,
    activeAccount,
    wasPatientFetched,
    timezone,
  } = props;

  if (!patient) {
    return null;
  }

  const age = patient.getAge();

  const production =
    wasStatsFetched && patientStats.get('productionCalendarYear')
      ? `$${patientStats.get('productionCalendarYear')}`
      : '$0';

  const bgStyle = {
    background: `url('/images/banners/${bgImgs[randomNum]}')`,
    backgroundSize: '70%',
  };

  const wasAllFetched = wasStatsFetched && patient && wasPatientFetched;
  const avatarSize = isResponsive() ? 'md' : 'xl';

  return (
    <Card className={styles.card} noBorder>
      <div className={styles.content}>
        <div className={styles.imageContainer} style={bgStyle}>
          {''}
        </div>
        {wasAllFetched && (
          <div className={styles.dataContainer}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatarContainer_avatar}>
                <Avatar user={patient} size={avatarSize} />
              </div>
              <div className={styles.badgeWrapper}>
                <div
                  className={classNames(
                    styles.avatarContainer_data_badge,
                    styles[`avatarContainer_data_badge_${patient.status.toLowerCase()}`],
                  )}
                >
                  <div>{patient.status}</div>
                </div>
              </div>
              <div className={styles.avatarContainer_data}>
                <div className={styles.avatarContainer_data_nameAge}>
                  <span className={styles.avatarContainer_data_nameAge_name}>
                    {patient.getFullName()}
                  </span>
                  <span className={styles.avatarContainer_data_nameAge_age}>
                    {typeof age === 'number' ? `, ${age}` : null}
                  </span>
                </div>
                <div className={styles.displayFlex}>
                  <span className={styles.avatarContainer_data_icon}>
                    {' '}
                    <Icon icon="envelope" />{' '}
                  </span>
                  <div className={styles.avatarContainer_data_email}>{patient.email || 'N/A'}</div>
                </div>
                <div className={styles.displayFlex}>
                  <span className={styles.avatarContainer_data_icon}>
                    {' '}
                    <Icon icon="phone" />{' '}
                  </span>
                  <div className={styles.avatarContainer_data_phone}>
                    {(patient.cellPhoneNumber && formatPhoneNumber(patient.cellPhoneNumber)) ||
                      'N/A'}
                  </div>
                </div>
                <ActionsDropdown
                  patient={patient}
                  align="left"
                  render={({ onClick }) => (
                    <Button
                      className={`${styles.actionsButtonNormal} ${styles.actionsButton} ${
                        ui.modal__save
                      } `}
                      onClick={onClick}
                    >
                      <div className={styles.actionText}>Actions</div>
                      <Icon className={styles.actionIcon} icon="caret-down" type="solid" />
                    </Button>
                  )}
                />
              </div>
            </div>
            <Grid className={styles.rightContainer}>
              <Row className={styles.rightContainer_content}>
                <Col xs={3}>
                  <InfoDump
                    label="Last Appt"
                    data={
                      patient.lastApptDate
                        ? getFormattedDate(patient.lastApptDate, 'MMM DD YYYY', timezone)
                        : null
                    }
                  />
                </Col>
                <Col xs={3}>
                  <InfoDump
                    label="Last Hygiene"
                    data={
                      patient.lastHygieneDate
                        ? getFormattedDate(patient.lastHygieneDate, 'MMM DD YYYY', timezone)
                        : null
                    }
                  />
                </Col>
                <Col xs={3}>
                  <InfoDump
                    label="DUE FOR HYGIENE"
                    component={HygieneData({
                      patient,
                      className: styles.fontStyle,
                      activeAccount,
                    })}
                  />
                </Col>
                <Col xs={3}>
                  <InfoDump label="Total Visits" data={patientStats.get('allApps') || '0'} />
                </Col>
              </Row>
              <Row className={styles.rightContainer_content}>
                <Col xs={3}>
                  <InfoDump
                    label="Next Appt"
                    data={
                      patient.nextApptDate
                        ? getFormattedDate(patient.nextApptDate, 'MMM DD YYYY', timezone)
                        : null
                    }
                  />
                </Col>
                <Col xs={3}>
                  <InfoDump
                    label="Last Recall"
                    data={
                      patient.lastRecallDate
                        ? getFormattedDate(patient.lastRecallDate, 'MMM DD YYYY', timezone)
                        : null
                    }
                  />
                </Col>
                <Col xs={3}>
                  <InfoDump
                    label="DUE FOR RECALL"
                    component={RecallData({
                      patient,
                      className: styles.fontStyle,
                      activeAccount,
                    })}
                  />
                </Col>
                <Col xs={3}>
                  <InfoDump label="PRODUCTION YTD" data={production} />
                </Col>
              </Row>
            </Grid>
          </div>
        )}
      </div>
    </Card>
  );
}

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(
  mapStateToProps,
  null,
)(TopDisplay);

TopDisplay.propTypes = {
  wasStatsFetched: PropTypes.bool,
  wasPatientFetched: PropTypes.bool,
  patientStats: PropTypes.instanceOf(Map),
  activeAccount: PropTypes.oneOfType([PropTypes.shape(accountShape), PropTypes.func]),
  patient: PropTypes.oneOfType([PropTypes.instanceOf(PatientModel), PropTypes.func]),
  timezone: PropTypes.string.isRequired,
};

TopDisplay.defaultProps = {
  wasStatsFetched: false,
  wasPatientFetched: false,
  patientStats: null,
  activeAccount: null,
  patient: null,
};
