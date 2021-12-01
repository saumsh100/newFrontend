import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tooltip } from '..';
import { Spinner } from './index';
import XIcon from './XIcon';
import CheckIcon from './CheckIcon';
import styles from './styles.scss';

const PhoneLookupBadge = ({ isSupport, isContactMethodSetting, mode }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    const visiblityTimeout = setTimeout(() => {
      setIsTooltipVisible(true);
    }, 2200);
    return () => {
      clearTimeout(visiblityTimeout);
    };
  }, []);

  const renderPhoneBadge = () => {
    const toolTipText = (
      <div className={styles.lookupTooltip}>
        <div className={styles.tooltipHead}>Phone Number</div>
        <div className={styles.tooltipSupport}>
          {isSupport ? `${mode} Supported` : `${mode} Not Supported`}
        </div>
        <div className={styles.tooltipHead}>Contact Method Settings</div>
        <div className={styles.tooltipStatus}>
          {isContactMethodSetting ? `${mode} Enabled` : `${mode} Disabled`}
        </div>
      </div>
    );
    return (
      <span className={classnames(styles.pocBadge, { [styles.isPoC]: isSupport })}>
        <Spinner />
        {isTooltipVisible && (
          <Tooltip
            overlayClassName={styles.lookupTooltipContainer}
            placement="bottom"
            trigger={['hover']}
            overlay={toolTipText}
          >
            <div className={styles.badge}>{isSupport ? <CheckIcon /> : <XIcon />}</div>
          </Tooltip>
        )}
      </span>
    );
  };

  return renderPhoneBadge();
};

PhoneLookupBadge.propTypes = {
  isSupport: PropTypes.bool.isRequired,
  isContactMethodSetting: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
};

PhoneLookupBadge.defaultProps = {};

export default PhoneLookupBadge;
