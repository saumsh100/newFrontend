import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';
import PhoneLookupBadge from '../../../library/PointOfContactBadge/PhoneLookupBadge';

const PhoneLookupComponent = ({ phoneLookupObj, preferences }) => {
  return (
    <div>
      <span
        className={classnames(styles.lookupLabel, styles.smsPaddingStyling, {
          [styles.greyLookupLabel]: !phoneLookupObj?.isSMSEnabled,
          [styles.greenLookupLabel]: phoneLookupObj?.isSMSEnabled,
        })}
      >
        SMS
        <PhoneLookupBadge
          isSupport={phoneLookupObj?.isSMSEnabled}
          isContactMethodSetting={preferences?.sms}
          mode="SMS"
        />
      </span>
      <span
        className={classnames(styles.lookupLabel, {
          [styles.greyLookupLabel]: !phoneLookupObj?.isVoiceEnabled,
          [styles.greenLookupLabel]: phoneLookupObj?.isVoiceEnabled,
        })}
      >
        Voice
        <PhoneLookupBadge
          isSupport={phoneLookupObj?.isVoiceEnabled}
          isContactMethodSetting={preferences?.phone}
          mode="Voice"
        />
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
  preferences: PropTypes.shape({
    sms: PropTypes.bool,
    phone: PropTypes.bool,
  }),
};

PhoneLookupComponent.defaultProps = {
  phoneLookupObj: {},
  preferences: {},
};
export default PhoneLookupComponent;
