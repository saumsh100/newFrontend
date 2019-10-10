
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import isNumber from 'lodash/isNumber';
import { formatPhoneNumber } from '@carecru/isomorphic';
import { Card, Avatar, Icon, Grid, Row, Col } from '../../../library';
import EnabledFeature from '../../../library/EnabledFeature';
import InfoDump from '../../Shared/InfoDump';
import HygieneData from '../../Shared/HygieneColumn';
import RecallData from '../../Shared/RecallColumn';
import { isResponsive } from '../../../../util/hub';
import { accountShape } from '../../../library/PropTypeShapes';
import PatientModel from '../../../../entities/models/Patient';
import ActionsDropdown from '../ActionsDropdown';
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

  if (!patient) {
    return null;
  }

  const age = patient.getAge();

  const production =
    wasStatsFetched && patientStats.get('productionCalendarYear')
      ? `$${patientStats.get('productionCalendarYear')}`
      : null;

  const bgStyle = {
    background: `url('/images/banners/${bgImgs[randomNum]}')`,
    backgroundSize: '70%',
  };

  const wasAllFetched = wasStatsFetched && patient && accountsFetched && wasPatientFetched;
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
              <div className={styles.avatarContainer_data}>
                <div className={styles.avatarContainer_data_nameAge}>
                  <div className={styles.avatarContainer_data_nameAge_name}>
                    {patient.getFullName()}
                  </div>
                  <div className={styles.avatarContainer_data_nameAge_age}>
                    {isNumber(age) ? `, ${age}` : null}
                  </div>
                  <div className={styles.avatarContainer_data_badge}>
                    <div
                      className={
                        styles[`avatarContainer_data_badge_${patient.status.toLowerCase()}`]
                      }
                    >
                      {patient.status}
                    </div>
                  </div>
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
                {patient.cellPhoneNumber && (
                  <div className={styles.displayFlex}>
                    <span className={styles.avatarContainer_data_icon}>
                      {' '}
                      <Icon icon="phone" />{' '}
                    </span>
                    <div className={styles.avatarContainer_data_phone}>
                      {formatPhoneNumber(patient.cellPhoneNumber)}
                    </div>
                  </div>
                )}
                <EnabledFeature
                  predicate={({ flags }) => flags.get('patient-actions-button')}
                  render={<ActionsDropdown patient={patient} />}
                />
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
                  <InfoDump label="PRODUCTION IN CALENDAR YEAR" data={production} />
                </Col>
              </Row>
            </Grid>
          </div>
        )}
      </div>
    </Card>
  );
}

TopDisplay.propTypes = {
  wasStatsFetched: PropTypes.bool,
  wasPatientFetched: PropTypes.bool,
  accountsFetched: PropTypes.bool,
  patientStats: PropTypes.instanceOf(Map),
  activeAccount: PropTypes.oneOfType([PropTypes.shape(accountShape), PropTypes.func]),
  patient: PropTypes.oneOfType([PropTypes.instanceOf(PatientModel), PropTypes.func]),
};

TopDisplay.defaultProps = {
  wasStatsFetched: false,
  accountsFetched: false,
  wasPatientFetched: false,
  patientStats: null,
  activeAccount: null,
  patient: null,
};
