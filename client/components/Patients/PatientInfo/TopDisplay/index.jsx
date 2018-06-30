
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Map } from 'immutable';
import { Card, Avatar, Icon, Grid, Row, Col } from '../../../library';
import InfoDump from '../../Shared/InfoDump';
import HygieneData from '../../Shared/HygieneColumn';
import RecallData from '../../Shared/RecallColumn';
import { formatPhoneNumber } from '../../../library/util/Formatters';
import { isResponsive } from '../../../../util/hub';
import { accountShape } from '../../../library/PropTypeShapes';
import ActiveAccountModel from '../../../../entities/models/ActiveAccount';
import PatientModel from '../../../../entities/models/Patient';
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

export default function TopDisplay(props) {
  const {
    patient,
    wasStatsFetched,
    patientStats,
    accountsFetched,
    activeAccount,
    wasPatientFetched,
  } = props;

  const age = patient && patient.birthDate ? moment().diff(patient.birthDate, 'years') : '';

  const production =
    wasStatsFetched && patientStats.get('productionCalendarYear')
      ? `$${patientStats.get('productionCalendarYear')}`
      : null;

  const bgStyle = {
    background: `url('/images/banners/${bgImgs[randomNum]}')`,
    backgroundSize: '100%',
  };

  const wasAllFetched = wasStatsFetched && patient && accountsFetched && wasPatientFetched;
  const avatarSize = isResponsive() ? 'md' : 'xl';

  return (
    <Card className={styles.card} noBorder>
      <div className={styles.content}>
        <div className={styles.imageContainer} style={bgStyle}>
          {''}
        </div>
        {wasAllFetched ? (
          <div className={styles.dataContainer}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatarContainer_avatar}>
                <Avatar user={patient} size={avatarSize} />
              </div>
              <div className={styles.avatarContainer_data}>
                <div className={styles.avatarContainer_data_name}>
                  {patient.getFullName()}, {age}
                </div>
                {patient.email && (
                  <div className={styles.displayFlex}>
                    <span className={styles.avatarContainer_data_icon}>
                      {' '}
                      <Icon icon="envelope" />{' '}
                    </span>
                    <div className={styles.avatarContainer_data_email}>{patient.email}</div>
                  </div>
                )}
                {patient.mobilePhoneNumber && (
                  <div className={styles.displayFlex}>
                    <span className={styles.avatarContainer_data_icon}>
                      {' '}
                      <Icon icon="phone" />{' '}
                    </span>
                    <div className={styles.avatarContainer_data_phone}>
                      {formatPhoneNumber(patient.mobilePhoneNumber)}
                    </div>
                  </div>
                )}
                {!isResponsive() && (
                  <div className={styles.paddingStatus}>
                    <div className={styles.avatarContainer_data_active}>{patient.status}</div>
                  </div>
                )}
              </div>
            </div>
            <Grid className={styles.rightContainer}>
              <Row className={styles.rightContainer_content}>
                <Col xs={4}>
                  <InfoDump
                    label="PATIENT DUE FOR HYGIENE"
                    component={HygieneData({
                      patient,
                      className: styles.fontStyle,
                      activeAccount,
                    })}
                  />
                </Col>
                <Col xs={4}>
                  <InfoDump label="INSURANCE INTERVAL" data={patient.insuranceInterval} />
                </Col>
                <Col xs={4}>
                  <InfoDump label="INSURANCE" />
                </Col>
              </Row>
              <Row className={styles.rightContainer_content}>
                <Col xs={4}>
                  <InfoDump
                    label="PATIENT DUE FOR RECALL"
                    component={RecallData({
                      patient,
                      className: styles.fontStyle,
                      activeAccount,
                    })}
                  />
                </Col>
                <Col xs={4}>
                  <InfoDump label="UNITS LEFT FOR COVERAGE" />
                </Col>
                <Col xs={4}>
                  <InfoDump label="PRODUCTION IN CALENDAR YEAR" data={production} />
                </Col>
              </Row>
            </Grid>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

TopDisplay.propTypes = {
  wasStatsFetched: PropTypes.bool,
  patientStats: PropTypes.instanceOf(Map),
  accountsFetched: PropTypes.bool,
  activeAccount: PropTypes.oneOfType([PropTypes.shape(accountShape), PropTypes.func]),
  wasPatientFetched: PropTypes.bool,
  patient: PropTypes.oneOfType([PropTypes.instanceOf(PatientModel), PropTypes.func]),
};

TopDisplay.defaultProps = {
  wasStatsFetched: false,
  accountsFetched: false,
  wasPatientFetched: false,
  patientStats: null,
  activeAccount: PropTypes.instanceOf(ActiveAccountModel),
  patient: PropTypes.instanceOf(PatientModel),
};
