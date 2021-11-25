import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';
import PhoneLookupBadge from '../../../library/PointOfContactBadge/PhoneLookupBadge';

const PhoneLookupComponent = ({ phoneLookupObj }) => {
  return (
    <div>
      <span
        className={classnames(styles.smsPaddingStyling, {
          [styles.greyLookupLabel]: !phoneLookupObj?.isSMSEnabled,
          [styles.greenLookupLabel]: phoneLookupObj?.isSMSEnabled,
        })}
      >
        SMS
        <PhoneLookupBadge isSupport={phoneLookupObj?.isSMSEnabled} mode="SMS" />
      </span>
      <span
        className={classnames({
          [styles.greyLookupLabel]: !phoneLookupObj?.isVoiceEnabled,
          [styles.greenLookupLabel]: phoneLookupObj?.isVoiceEnabled,
        })}
      >
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
