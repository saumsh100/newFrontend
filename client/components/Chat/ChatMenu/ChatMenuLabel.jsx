
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { Icon } from '../../library';

export default function ChatMenuLabel({ label, count, ...rest }) {
  return (
    <div className={styles.chatDropDown} {...rest}>
      <span className={styles.chatLabel}>
        {label} {count(label)}
      </span>
      <Icon icon="caret-up" type="solid" />
    </div>
  );
}

ChatMenuLabel.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.func.isRequired,
};
