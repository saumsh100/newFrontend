
import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '../../../util/isomorphic';
import { getFormattedDate, Icon } from '../../library';
import EnabledFeature from '../../library/EnabledFeature';
import styles from './styles.scss';

const Info = ({
  patient,
  insuranceCarrier,
  insuranceMemberId,
  insuranceGroupId,
  requestingUser,
  title,
  timezone,
}) => {
  const user = patient || requestingUser;
  if (user) {
    const carrier = user.insuranceCarrier || insuranceCarrier;
    const memberId = user.insuranceMemberId || insuranceMemberId;
    const groupId = user.insuranceGroupId || insuranceGroupId;

    return (
      <div className={styles.container}>
        <div className={styles.subHeader}>{title}</div>

        {user.birthDate && (
          <div className={styles.data}>
            <Icon icon="birthday-cake" size={0.9} type="solid" />
            <div className={styles.data_text}>
              {getFormattedDate(user.birthDate, 'MMMM Do, YYYY', timezone)}
            </div>
          </div>
        )}

        {title === 'Requester Info' && user.gender && (
          <div className={styles.data}>
            <Icon icon="venus-mars" size={0.9} type="solid" />
            <div className={styles.data_text}>{`${user.gender}`.charAt(0).toUpperCase()}</div>
          </div>
        )}

        {user.phoneNumber && (
          <div className={styles.data}>
            <Icon icon="phone" size={0.9} type="solid" />
            <div className={styles.data_text}>
              {user.phoneNumber[0] === '+' ? formatPhoneNumber(user.phoneNumber) : user.phoneNumber}
            </div>
          </div>
        )}

        {user.email && (
          <div className={styles.data}>
            <Icon icon="envelope" size={0.9} type="solid" />
            <div className={styles.data_text}>{user.email}</div>
          </div>
        )}

        <EnabledFeature
          predicate={({ flags }) => flags.get('booking-widget-insurance')}
          render={() => (
            <div className={styles.multilineData}>
              {carrier && <Icon icon="medkit" size={0.9} type="solid" />}
              <div className={styles.data_text}>
                {carrier || 'n/a'}
                {(memberId || groupId) && (
                  <span className={styles.subData}>
                    <br />
                    Member ID: {memberId || 'n/a'}
                    <br />
                    Group ID: {groupId || 'n/a'}
                  </span>
                )}
              </div>
            </div>
          )}
        />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.subHeader}>{title}</div>
      <div className={styles.data}>n/a</div>
    </div>
  );
};

Info.propTypes = {
  insuranceCarrier: PropTypes.string,
  insuranceMemberId: PropTypes.string,
  insuranceGroupId: PropTypes.string,
  patient: PropTypes.objectOf(PropTypes.any),
  requestingUser: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  timezone: PropTypes.string.isRequired,
};

Info.defaultProps = {
  insuranceCarrier: null,
  insuranceMemberId: null,
  insuranceGroupId: null,
  requestingUser: null,
  patient: null,
  title: '',
};

export default Info;
