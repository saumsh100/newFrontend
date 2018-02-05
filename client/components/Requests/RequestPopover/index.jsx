
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Card,
  Avatar,
  Icon,
  SContainer,
  SHeader,
  SBody,
  SFooter,
  Button,
} from '../../library';
import { FormatPhoneNumber } from '../../library/util/Formatters';
import styles from './styles.scss';

export default function RequestPopover(props) {
  const {
    patient,
    request,
    time,
    service,
    note,
  } = props;

  const appointmentDate = moment(request.startDate).format('dddd LL');
  const requestedAt = moment(request.createdAt).format('MMM D, hh:mm A')

  return (
    <Card className={styles.card} noBorder>
      <SContainer>
        <SHeader className={styles.header}>
          <Avatar user={patient} size="xs" />
          <div className={styles.header_text}>
            {patient.firstName} {patient.lastName}
          </div>
          <div
            className={styles.closeIcon}
            onClick={props.closePopover}
          >
            <Icon icon="times" />
          </div>
        </SHeader>

        <SBody className={styles.body} >
          <div className={styles.container}>
            <div className={styles.subHeader}>
              Date
            </div>
            <div className={styles.data}>
              {appointmentDate}
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.subHeader}>
              Time
            </div>
            <div className={styles.data}>
              {time}
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.subHeader}>
              Appointment Type
            </div>
            <div className={styles.data}>
              {service}
            </div>
          </div>

          {patient.phoneNumber || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Patient Info
              </div>

              <div className={styles.data}>
                {patient.phoneNumber ?
                  <Icon icon="phone" size={0.9} /> : null}
                <div className={styles.data_text}>
                  {patient.phoneNumber && patient.phoneNumber[0] === '+' ?
                    FormatPhoneNumber(patient.phoneNumber) : patient.phoneNumber}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email ? <Icon icon="envelope" size={0.9} /> : null}
                <div className={styles.data_text}>{patient.email}</div>
              </div>
            </div>) : (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Patient Info
              </div>
              <div className={styles.data}>
                n/a
              </div>
            </div>
          )}

          {note ? (<div className={styles.container}>
            <div className={styles.subHeader}>
              Note
            </div>
            <div className={styles.data}>
              <div className={styles.data_note}>{note}</div>
            </div>
          </div>) : null}

          <div className={styles.requestedAt}>
            Requested: {requestedAt}
          </div>
        </SBody>

        <SFooter className={styles.footer}>
          <Button
            border="blue"
            dense
            compact
            onClick={props.rejectRequest}
          >
            Reject
          </Button>
          <Button
            color="blue"
            dense
            compact
            className={styles.editButton}
            onClick={props.acceptRequest}
          >
            Accept
          </Button>
        </SFooter>
      </SContainer>
    </Card>
  );
}

RequestPopover.propTypes = {
  patient: PropTypes.object,
  appointment: PropTypes.object,
  age: PropTypes.number,
  closePopover: PropTypes.func,
  editAppointment: PropTypes.func,
  scheduleView: PropTypes.string,
  acceptRequest: PropTypes.func,
  rejectRequest: PropTypes.func,
};