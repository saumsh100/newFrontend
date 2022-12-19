import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PatientUser from '../../entities/models/PatientUser';
import styles from './reskin-styles.scss';
import { getFormattedDate, getTodaysDate } from '../library';

const RequestData = ({
  time,
  service,
  name,
  requestCreatedAt,
  requestingUser,
  birthDate,
  timezone,
  onWaitlist,
}) => {
  const age = birthDate ? `, ${getTodaysDate(timezone).diff(birthDate, 'years')}` : '';

  return (
    <div className={styles.requestData}>
      <div className={styles.waitlistDetails}>
        <div className={styles.requestData__time}>{time}</div>
        {onWaitlist && <div className={styles.joinedWaitlist}>Joined Waitlist</div>}
      </div>
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
          Requested on: {getFormattedDate(requestCreatedAt, 'MMM D, hh:mm A', timezone)}
        </div>
      </div>
    </div>
  );
};

RequestData.propTypes = {
  name: PropTypes.string.isRequired,
  requestCreatedAt: PropTypes.string.isRequired,
  requestingUser: PropTypes.instanceOf(PatientUser),
  service: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  birthDate: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  onWaitlist: PropTypes.bool.isRequired,
};

RequestData.defaultProps = { requestingUser: null };

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps, null)(RequestData);
