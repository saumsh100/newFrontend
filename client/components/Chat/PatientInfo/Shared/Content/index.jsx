
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default function Content({ title, value, children }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>
        {value}
        {children()}
      </div>
    </div>
  );
}

Content.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.func,
};

Content.defaultProps = { children: () => null };
