
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Grid, Row, Col } from '../../../library';
import InfoDump from '../../Shared/InfoDump';
import RecallDropDowns from '../../Shared/RecallDropDowns';
import ReminderDropDowns from '../../Shared/ReminderDropDowns';
import styles from './styles.scss';
import { validDateValue } from '../../Shared/helpers';
import { FormatPhoneNumber } from '../../../library/util/Formatters';

export default function DataTable(props) {
  const { patient } = props;

  const recallComp = <RecallDropDowns patient={patient} />;
  const reminderComp = <ReminderDropDowns patient={patient} />;

  return (
    <div className={styles.grid}>
      <div className={styles.row}>
        <InfoDump
          label="PRIMARY EMAIL"
          data={patient.email}
          className={styles.infoDump}
          type="email"
        />

        <InfoDump
          label="PRIMARY-NUMBER"
          data={FormatPhoneNumber(patient.mobilePhoneNumber)}
          className={styles.infoDump}
        />
        <InfoDump
          label="SECONDARY-NUMBER"
          data={FormatPhoneNumber(
            patient.homePhoneNumber || patient.prefPhoneNumber || patient.workPhoneNumber
          )}
          className={styles.infoDump}
        />
      </div>
      <div className={styles.row}>
        <InfoDump label="INSURANCE" />
      </div>
      <div className={styles.col}>
        <InfoDump label="RECALLS SENT" component={recallComp} />
        {patient.nextApptDate ? (
          <div className={styles.subHeaderSmall}>
            Next Appointment: {moment(patient.nextApptDate).format('MMMM Do YYYY')}
          </div>
        ) : (
          <div className={styles.subHeaderSmall}>Next Appointment: n/a </div>
        )}
      </div>
      <div className={styles.col}>
        <InfoDump label="REMINDERS SENT" component={reminderComp} />
      </div>
      <div className={styles.row}>
        <InfoDump
          label="LAST RECALL VISIT"
          data={validDateValue(patient.lastRecallDate)}
          className={styles.infoDump}
        />
        <InfoDump
          label="LAST HYGIENE VISIT"
          data={validDateValue(patient.lastHygieneDate)}
          className={styles.infoDump}
        />
        <InfoDump label="LAST X-RAY" className={styles.infoDump} />
      </div>
    </div>
  );
}

DataTable.propTypes = {
  patient: PropTypes.object,
};
