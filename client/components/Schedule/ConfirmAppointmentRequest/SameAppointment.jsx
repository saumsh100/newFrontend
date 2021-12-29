import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Button,
  getUTCDate,
  getFormattedTime,
  Avatar,
  SHeader,
  getTodaysDate,
  Icon,
} from '../../library';
import { appointmentShape } from '../../library/PropTypeShapes';
import Patient from '../../../entities/models/Patient';
import styles from './styles.scss';
import Item from './Item';
import { formatPhoneNumber } from '../../../util/isomorphic';

const SameAppointment = (props) => {
  const { patient, appointment, setSelected, selectedApp, timezone } = props;

  if (!patient || !appointment) {
    return null;
  }

  const startDate = getUTCDate(appointment.startDate, timezone);
  const endDate = getUTCDate(appointment.endDate, timezone);
  const createdAt = getUTCDate(appointment.createdAt, timezone);
  const birthDate = patient.get('birthDate');
  const age = birthDate ? `, ${getTodaysDate(timezone).diff(birthDate, 'years')}` : '';
  const appointmentDate = getUTCDate(startDate, timezone).format('LL');
  const patientPhone = patient.mobilePhoneNumber || patient.cellPhoneNumber;
  return (
    <Button
      className={classNames(styles.dataContainer, styles.singleItem, {
        [styles.appointmentIsSelected]: appointment.id === (selectedApp && selectedApp.id),
      })}
      onClick={() => {
        setSelected(appointment);
      }}
    >
      <div className={styles.summaryData}>
        <div className={styles.userCard}>
          <SHeader className={styles.header}>
            <Avatar user={patient} size="xs" />
            <div className={styles.header_text}>
              {patient.firstName} {patient.lastName}
              {age}
            </div>
          </SHeader>
        </div>
        <div className={styles.itemContainer}>
          {patientPhone && (
            <div className={styles.contactItem}>
              <Icon icon="phone" size={0.9} type="solid" className={styles.icon} />
              <div className={styles.data_text}>{formatPhoneNumber(patientPhone)}</div>
            </div>
          )}
        </div>
        <div className={styles.itemContainer}>
          <Item
            title="DATE"
            index="DATE"
            value={appointmentDate}
            extra={[
              {
                extraTitle: 'Created at:',
                extraValue: createdAt.format('LL'),
              },
            ]}
          />
          <Item title="TIME" index="TIME" value={getFormattedTime(startDate, endDate, timezone)} />
        </div>
      </div>
    </Button>
  );
};

SameAppointment.propTypes = {
  patient: PropTypes.instanceOf(Patient).isRequired,
  appointment: PropTypes.shape(appointmentShape).isRequired,
  setSelected: PropTypes.func.isRequired,
  selectedApp: PropTypes.shape(appointmentShape).isRequired,
  timezone: PropTypes.string.isRequired,
};

export default SameAppointment;
