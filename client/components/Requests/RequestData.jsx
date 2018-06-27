
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PatientUser from '../../entities/models/PatientUser';
import styles from './styles.scss';

export default function RequestData(props) {
  const {
    time, service, name, requestCreatedAt, requestingUser,
  } = props;

  return (
    <div className={styles.requestData}>
      <div className={styles.requestData__time}>{time}</div>
      <div className={styles.requestData__details}>
        <div className={styles.requestData__nameAge}>
          <div className={styles.requestData__name}>{name}</div>
        </div>
        <div className={styles.requestData__service}>{service}</div>
      </div>
      <div className={styles.requestedText}>
        {requestingUser && (
          <div className={styles.requestedText__container}>
            <span className={styles.requestedText__createdAt}>
              {' '}
              Requested by:{' '}
            </span>
            <span className={styles.requestedText__requestedBy}>
              {requestingUser.get('firstName')} {requestingUser.get('lastName')}
            </span>
          </div>
        )}
        <div className={styles.requestedText__createdAt}>
          Requested on: {moment(requestCreatedAt).format('MMM D, hh:mm A')}
        </div>
      </div>
    </div>
  );
}

RequestData.propTypes = {
  age: PropTypes.string,
  name: PropTypes.string,
  phoneNumber: PropTypes.string,
  requestCreatedAt: PropTypes.string,
  requestingUser: PropTypes.instanceOf(PatientUser),
  service: PropTypes.string,
  time: PropTypes.string,
};
