
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Icon } from '../../../../library';
import InfoDump from '../../../Shared/InfoDump';
import RecallDropDowns from '../../../Shared/RecallDropDowns';
import ReminderDropDowns from '../../../Shared/ReminderDropDowns';
import styles from '../styles.scss';
import { validDateValue } from '../../../Shared/helpers';

export default function AppointmentsTab(props) {
  const { patient } = props;

  const recallComp = <RecallDropDowns patient={patient} />;
  const reminderComp = <ReminderDropDowns patient={patient} />;

  return (
    <Grid className={styles.grid}>
      <Row className={styles.remindersRow}>
        <Col xs={12}>
          <InfoDump label="RECALLS SENT" component={recallComp} />
        </Col>
        <Col xs={12} className={styles.infoPadding}>
          <InfoDump label="REMINDERS SENT" component={reminderComp} />
        </Col>
      </Row>
      <div className={styles.lastAppointmentHeader}> Last Appointment </div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump
            label="RECALL"
            data={validDateValue(patient.lastRecallDate)}
          />
        </Col>
        <Col xs={6}>
          <InfoDump
            label="HYGIENE"
            data={validDateValue(patient.lastHygieneDate)}
          />
        </Col>
      </Row>
      <div className={styles.subHeader}> Continuing Care </div>
      <Row className={styles.row}>
        <Col xs={6}>
          <InfoDump label="RECALL" />
        </Col>
        <Col xs={6}>
          <InfoDump label="HYGIENE" />
        </Col>
      </Row>
      <div className={styles.subHeader}> Other </div>
      <Row className={styles.row}>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump label="LAST X-RAY" />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump
            label="LAST RESTORATIVE VISIT"
            data={validDateValue(patient.lastRestorativeDate)}
          />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump label="LAST RECALL VISIT" />
        </Col>
        <Col xs={6} className={styles.paddingCol}>
          <InfoDump label="TOTAL RECALL VISITS" />
        </Col>
        <Col xs={6}>
          <InfoDump label="LAST HYGIENE VISIT" />
        </Col>
        <Col xs={6}>
          <InfoDump label="TOTAL HYGIENCE VISITS" />
        </Col>
      </Row>
    </Grid>
  );
}

AppointmentsTab.propTypes = {
  patient: PropTypes.shape({
    lastRestorativeDate: PropTypes.string,
    lastRecallDate: PropTypes.string,
    lastHygieneDate: PropTypes.string,
  }),
};
