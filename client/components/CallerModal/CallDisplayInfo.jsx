
import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '../../util/isomorphic';
import styles from './styles.scss';

export default function CallDisplayInfo({ call }) {
  return (
    <div className={styles.callInfo}>
      <div className={styles.callInfo_content}>
        <div className={styles.callInfo_body}>
          <div className={styles.callInfo_desc}>Number: </div>
          <div className={styles.callInfo_data}>{formatPhoneNumber(call.callerNum)}</div>
        </div>
        <div className={styles.callInfo_body}>
          <div className={styles.callInfo_desc}>City: </div>
          <div className={styles.callInfo_data}>{call.callerCity}</div>
        </div>
        <div className={styles.callInfo_body}>
          <div className={styles.callInfo_desc}>Country: </div>
          <div className={styles.callInfo_data}>{call.callerCountry}</div>
        </div>
        <div className={styles.callInfo_body}>
          <div className={styles.callInfo_desc}>State: </div>
          <div className={styles.callInfo_data}>{call.callerState}</div>
        </div>
      </div>
      <div className={styles.callInfo_content2}>
        <div className={styles.callInfo_body}>
          <div className={styles.callInfo_desc}>Zip: </div>
          <div className={styles.callInfo_data}>{call.callerZip}</div>
        </div>
        <div className={styles.callInfo_body}>
          <div className={styles.callInfo_desc}>Duration: </div>
          <div className={styles.callInfo_data}>{call.duration}</div>
        </div>
        <div className={styles.callInfo_body}>
          <div className={styles.callInfo_desc}>Source: </div>
          <div className={styles.callInfo_data}>{call.callSource}</div>
        </div>
        <div className={styles.callInfo_body}>
          <div className={styles.callInfo_desc}>Total Calls: </div>
          <div className={styles.callInfo_data}>{call.totalCalls}</div>
        </div>
      </div>
    </div>
  );
}

CallDisplayInfo.propTypes = { call: PropTypes.objectOf(PropTypes.any).isRequired };
