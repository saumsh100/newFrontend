
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Card,
  SContainer,
  SHeader,
  SBody,
  SFooter,
  Avatar,
  Icon,
  Button,
} from '../../library';
import styles from './styles.scss';
import { FormatPhoneNumber } from '../util/Formatters';

export default function PatientProfile(props) {
  const {
    patient,
    age,
    closePopover,
    isPatientUser,
  } = props;

  const lastName = age ? `${patient.lastName},` : patient.lastName;

  const patientPhone = isPatientUser ? 'phoneNumber' : 'mobilePhoneNumber';


  const emptyData = (subHeader) => {
    return (
      <div className={styles.container}>
        <div className={styles.subHeader}>
          {subHeader}
        </div>
        <div className={styles.data}>
          n/a
        </div>
      </div>
    );
  };

  const showNextAppt = !isPatientUser ? emptyData('Next Appointment') : null;

  return (
    <Card className={styles.card} noBorder id="appPopOver" >
      <SContainer>
        <SHeader className={styles.header}>
          <Avatar user={patient} size="xs" />
          <div className={styles.header_text}>
            {patient.firstName} {lastName} {age}
          </div>
          <div
            className={styles.closeIcon}
            onClick={closePopover}
          >
            <Icon icon="times" />
          </div>
        </SHeader>
        <SBody className={styles.body} >
          {patient.gender ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Gender
              </div>
              <div className={styles.data}>
                <span className={styles.basicText}>{patient.gender}</span>
              </div>
            </div>) : null}

          {patient[patientPhone] || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Contact Info
              </div>

              <div className={styles.data}>
                {patient[patientPhone] ?
                  <Icon icon="phone" size={0.9} /> : null}
                <div className={styles.data_text}>
                  {patient[patientPhone] && patient[patientPhone][0] === '+' ?
                    FormatPhoneNumber(patient[patientPhone]) : patient[patientPhone]}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email ? <Icon icon="envelope" size={0.9} /> : null}
                <div className={styles.data_text}>{patient.email}</div>
              </div>
            </div>) : emptyData('Contact Info')}

          {patient.nextApptDate ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Next Appointment
              </div>
              <div className={styles.data}>
                {moment(patient.nextApptDate).format('MMM Do, YYYY h:mm A')}

              </div>
            </div>
            ) : showNextAppt}

          {isPatientUser && patient.endDate ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Next Appointment
              </div>
              <div className={styles.data}>
                {moment(patient.endDate).format('MMM Do, YYYY h:mm A')}
              </div>
            </div>
          ) : null}

          {patient.lastApptDate ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Last Appointment
              </div>
              <div className={styles.data}>
                {moment(patient.lastApptDate).format('MMM Do, YYYY h:mm A')}
              </div>
            </div>
          ) : emptyData('Last Appointment')}

          {patient.address && Object.keys(patient.address).length ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Address
              </div>
              <div className={styles.data}>
                {patient.address.street}
              </div>
              <div className={styles.data}>
                {patient.address.city}
              </div>
              <div className={styles.data}>
                {patient.address.country}
              </div>
            </div>
          ) : emptyData('Address')}
        </SBody>

        <SFooter className={styles.footer}>
          <Button
            border="blue"
            onClick={closePopover}
            dense
            compact
          >
            Close
          </Button>
          {!isPatientUser ?
            <Button
              color="blue"
              onClick={() => props.editPatient(patient.id)}
              dense
              compact
              className={styles.editButton}
            >
              Edit
            </Button> : null}
        </SFooter>
      </SContainer>
    </Card>
  );
}

PatientProfile.propTypes = {
  closePopover: PropTypes.func.isRequired,
};
