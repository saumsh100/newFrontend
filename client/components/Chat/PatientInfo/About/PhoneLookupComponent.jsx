import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';
import PhoneLookupBadge from '../../../library/PointOfContactBadge/PhoneLookupBadge';

const PhoneLookupComponent = ({ phoneLookupObj, preferences }) => {
  const isGreenSmsStyle = phoneLookupObj?.isSMSEnabled && preferences?.sms;
  const isGreenVoiceStyle = phoneLookupObj?.isVoiceEnabled && preferences?.phone;
  return (
    <div>
      <span
        className={classnames(styles.lookupLabel, styles.smsPaddingStyling, {
          [styles.greyLookupLabel]: !isGreenSmsStyle,
          [styles.greenLookupLabel]: isGreenSmsStyle,
        })}
      >
        SMS
        <PhoneLookupBadge
          isSupport={phoneLookupObj?.isSMSEnabled}
          isContactMethodSetting={preferences?.sms}
          mode="SMS"
          isGreen={isGreenSmsStyle}
        />
      </span>
      <span
        className={classnames(styles.lookupLabel, {
          [styles.greyLookupLabel]: !isGreenVoiceStyle,
          [styles.greenLookupLabel]: isGreenVoiceStyle,
        })}
      >
        Voice
        <PhoneLookupBadge
          isSupport={phoneLookupObj?.isVoiceEnabled}
          isContactMethodSetting={preferences?.phone}
          mode="Voice"
          isGreen={isGreenVoiceStyle}
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
