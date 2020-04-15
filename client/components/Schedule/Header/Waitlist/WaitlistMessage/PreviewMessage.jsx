
import React from 'react';
import PropTypes from 'prop-types';
import { SMSPreview } from '../../../../library';
import styles from './styles.scss';

const formatPhoneNumber = phone =>
  `+1 (${phone.substr(2, 3)}) ${phone.substr(5, 3)}-${phone.substr(8, 4)}`;

const PreviewMessage = ({ message, phoneNumber }) => (
  <>
    <label className={styles.columnLabel}>Preview</label>
    <div className={styles.columnBody}>
      <SMSPreview from={formatPhoneNumber(phoneNumber)} message={message} />
    </div>
  </>
);
PreviewMessage.propTypes = {
  message: PropTypes.string,
  phoneNumber: PropTypes.string,
};

PreviewMessage.defaultProps = {
  message: '',
  phoneNumber: '',
};

export default PreviewMessage;
