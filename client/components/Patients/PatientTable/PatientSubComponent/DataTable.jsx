
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { PointOfContactBadge } from '../../../library';
import InfoDump from '../../Shared/InfoDump';
import RecallDropDowns from '../../Shared/RecallDropDowns';
import ReminderDropDowns from '../../Shared/ReminderDropDowns';
import { validDateValue } from '../../Shared/helpers';
import { FormatPhoneNumber } from '../../../library/util/Formatters';
import { patientShape } from '../../../library/PropTypeShapes/index';
import styles from './styles.scss';

export default function DataTable(props) {
  const { patient } = props;

  const recallComp = <RecallDropDowns patient={patient} />;
  const reminderComp = <ReminderDropDowns patient={patient} />;
  const secondaryNumber =
    patient.homePhoneNumber || patient.prefPhoneNumber || patient.workPhoneNumber;

  return (
    <div className={styles.grid}>
      <div className={styles.row}>
        <InfoDump
          label="PRIMARY EMAIL"
          data={patient.email}
          className={styles.infoDump}
          type="email"
        >
          {() => <PointOfContactBadge patientId={patient.id} channel="email" />}
        </InfoDump>

        <InfoDump
          label="PRIMARY-NUMBER"
          data={FormatPhoneNumber(patient.mobilePhoneNumber)}
          className={styles.infoDump}
        >
          {() => <PointOfContactBadge patientId={patient.id} channel="phone" />}
        </InfoDump>
        <InfoDump
          label="SECONDARY-NUMBER"
          data={FormatPhoneNumber(secondaryNumber)}
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

DataTable.propTypes = { patient: PropTypes.shape(patientShape).isRequired };
