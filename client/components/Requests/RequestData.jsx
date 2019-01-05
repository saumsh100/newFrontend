
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PatientUser from '../../entities/models/PatientUser';
import styles from './styles.scss';

export default function RequestData(props) {
  const { time, service, name, requestCreatedAt, requestingUser, birthDate } = props;

  const age = birthDate ? `, ${moment().diff(birthDate, 'years')}` : '';

  return (
    <div className={styles.requestData}>
      <div className={styles.requestData__time}>{time}</div>
      <div className={styles.requestData__details}>
        <div className={styles.requestData__nameAge}>
          <div className={styles.requestData__name}>
            {name}
            {age}
          </div>
        </div>
        <div className={styles.requestData__service}>{service}</div>
      </div>
      <div className={styles.requestedText}>
        {requestingUser && (
          <div className={styles.requestedText__container}>
            <span className={styles.requestedText__createdAt}> Requested by: </span>
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
  name: PropTypes.string.isRequired,
  requestCreatedAt: PropTypes.string.isRequired,
  requestingUser: PropTypes.instanceOf(PatientUser),
  service: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  birthDate: PropTypes.string.isRequired,
};

RequestData.defaultProps = { requestingUser: null };
