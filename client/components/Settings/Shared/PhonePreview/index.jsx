
import React from 'react';
import { normalizePhone } from '@carecru/isomorphic';
import PropTypes from 'prop-types';
import Icon from '../../../library/Icon';
import LinkButton from '../../../library/ui-kit/Button/LinkButton';
import styles from './styles.scss';

export default function PhonePreview({ openCallTestModal, confirmed, twilioPhone }) {
  const message = confirmed ? (
    <p className={styles.message}>
      Hi there, this is a friendly reminder for your upcoming appointment at{' '}
      <strong>Sunshine Smiles </strong>on <strong>Friday, June 14th</strong> at{' '}
      <strong>3:50pm.</strong> To speak to someone at our front desk, press 0. To play back this
      message, press 9.
    </p>
  ) : (
    <p className={styles.message}>
      Hi there, we are calling to confirm your upcoming appointment at{' '}
      <strong>Sunshine Smiles</strong> on <strong>Friday, June 14th</strong> at{' '}
      <strong>3:50pm.</strong>
      To confirm, press 1. To speak to someone at our front desk, press 0. To play back this
      message, press 9.
    </p>
  );

  const audioFile = `/audio/${confirmed ? 'confirmed' : 'unconfirmed'}-reminder.wav`;

  return (
    <div className={styles.smsPreviewWrapper}>
      <div className={styles.phoneArtboard}>
        <div className={styles.header}>
          <div className={styles.phoneIcon}>
            <Icon icon="phone" type="solid" />
          </div>
          <div className={styles.title}>PHONE</div>
        </div>
        <div className={styles.body}>
          <div className={styles.subHeader}>
            <span className={styles.caller}>Call from</span>
            <div className={styles.phoneNumber}>{normalizePhone(twilioPhone || '')}</div>
            <div className={styles.location}>Vancouver, BC</div>
          </div>
          <div className={styles.footer}>
            <span className={styles.transcript}>Transcript</span>
            <div>{message}</div>
            <audio controls controlsList="nodownload">
              <track kind="captions" />
              <source src={audioFile} type="audio/ogg" />
            </audio>
            <LinkButton onClick={openCallTestModal} className={styles.modalLink}>
              Call me to play reminder
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}

PhonePreview.propTypes = {
  openCallTestModal: PropTypes.func.isRequired,
  confirmed: PropTypes.bool.isRequired,
  twilioPhone: PropTypes.string.isRequired,
};
