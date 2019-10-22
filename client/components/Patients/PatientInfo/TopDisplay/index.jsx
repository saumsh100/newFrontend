
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import isNumber from 'lodash/isNumber';
import { formatPhoneNumber } from '@carecru/isomorphic';
import { Card, Avatar, Icon, Grid, Row, Col, Tooltip } from '../../../library';
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
      : '$0';

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
                <ActionsDropdown
                  patient={patient}
                  render={({ onClick }) => (
                    <div className={styles.avatarContainer_data_nameAge}>
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={this.handleKeyDown}
                        onClick={onClick}
                      >
                        <span className={styles.avatarContainer_data_nameAge_name}>
                          {patient.getFullName()}
                        </span>
                        <span className={styles.avatarContainer_data_nameAge_age}>
                          {isNumber(age) ? `, ${age}` : null}
                        </span>
                        <span className={styles.actionsButtonSmall}>
                          <Icon icon="caret-down" type="solid" className={styles.actionIcon} />
                        </span>
                      </div>
                    </div>
                  )}
                />
                <div className={styles.avatarContainer_data_badge}>
                  <div
                    className={styles[`avatarContainer_data_badge_${patient.status.toLowerCase()}`]}
                  >
                    {patient.status}
                  </div>
                </div>
                <div className={styles.displayFlex}>
                  <span className={styles.avatarContainer_data_icon}>
                    {' '}
                    <Icon icon="envelope" />{' '}
                  </span>
                  <div className={styles.avatarContainer_data_email}>
                    {patient.email || (
                      <Tooltip placement="right" trigger={['hover']} overlay="Edit in PMS">
                        <div>n/a</div>
                      </Tooltip>
                    )}
                  </div>
                </div>
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
              </div>
            </div>

            <Grid className={styles.rightContainer}>
              <Row className={styles.rightContainer_content}>
                <Col xs={3}>
                  <InfoDump
                    label="Last Appt"
                    data={
                      patient.lastApptDate
                        ? moment(patient.lastApptDate).format('MMM DD YYYY')
                        : null
                    }
                  />
                </Col>
                <Col xs={3}>
                  <InfoDump
                    label="Last Hygiene"
                    data={
                      patient.lastHygieneDate
                        ? moment(patient.lastHygieneDate).format('MMM DD YYYY')
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
                  <InfoDump label="Total Visits" data={patientStats.get('allApps') || 0} />
                </Col>
              </Row>
              <Row className={styles.rightContainer_content}>
                <Col xs={3}>
                  <InfoDump
                    label="Next Appt"
                    data={
                      patient.nextApptDate
                        ? moment(patient.nextApptDate).format('MMM DD YYYY')
                        : null
                    }
                  />
                </Col>
                <Col xs={3}>
                  <InfoDump
                    label="Last Recall"
                    data={
                      patient.lastRecallDate
                        ? moment(patient.lastRecallDate).format('MMM DD YYYY')
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
