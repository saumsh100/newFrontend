import React from 'react';
import PropTypes from 'prop-types';
import styles from './reskin-styles.scss';
import { StandardButton } from '../../library/index';

export default function ChatMenuLabel({ label, count, ...rest }) {
  return (
    <div {...rest}>
      <StandardButton className={styles.chatDropDown} variant="secondary" iconRight="caret-up">
        {label} {count(label)}
      </StandardButton>
    </div>
  );
}

ChatMenuLabel.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.func.isRequired,
};
