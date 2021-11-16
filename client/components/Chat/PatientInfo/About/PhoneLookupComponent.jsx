import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import PhoneLookupBadge from '../../../library/PointOfContactBadge/PhoneLookupBadge';

const PhoneLookupComponent = ({ phoneLookupObj }) => {
  return (
    <div className={styles.phoneLookup}>
      <span className={styles.smsLookup}>
        SMS
        <PhoneLookupBadge isSupport={phoneLookupObj?.isSMSEnabled} mode="SMS" />
      </span>
      <span className="voice-lookup">
        Voice
        <PhoneLookupBadge isSupport={phoneLookupObj?.isVoiceEnabled} mode="Voice" />
      </span>
    </div>
  );
};

PhoneLookupComponent.propTypes = {
  phoneLookupObj: PropTypes.shape({
    isPhoneLookupChecked: PropTypes.bool,
    isSMSEnabled: PropTypes.bool,
    isVoiceEnabled: PropTypes.bool,
  }),
};

PhoneLookupComponent.defaultProps = {
  phoneLookupObj: {},
};
export default PhoneLookupComponent;
