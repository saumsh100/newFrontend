
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default function Content({ title, value }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        {title}
      </div>
      <div className={styles.content}>
        {value}
      </div>
    </div>
  );
}

Content.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
