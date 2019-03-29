
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatPhoneNumber } from '@carecru/isomorphic';
import { PointOfContactBadge } from '../../../library';
import InfoDump from '../../Shared/InfoDump';
import { validDateValue } from '../../Shared/helpers';
import { patientShape } from '../../../library/PropTypeShapes/index';
import styles from './styles.scss';

export default function DataTable(props) {
  const { patient } = props;

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
          data={formatPhoneNumber(patient.mobilePhoneNumber)}
          className={styles.infoDump}
        >
          {() => <PointOfContactBadge patientId={patient.id} channel="phone" />}
        </InfoDump>
        <InfoDump
          label="SECONDARY-NUMBER"
          data={formatPhoneNumber(secondaryNumber)}
          className={styles.infoDump}
        />
      </div>
      <div className={styles.row}>
        <InfoDump label="INSURANCE" />
      </div>
      <div className={styles.col}>
        <div className={styles.subHeaderSmall}>
          Next Appointment:{' '}
          {patient.nextApptDate ? moment(patient.nextApptDate).format('MMMM Do YYYY') : 'n/a'}
        </div>
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
