import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.scss';

export default function Summary({ title, items, className }) {
  const style = classnames(styles.summary, className);
  return (
    <div className={style}>
      <div className={styles.title}>{title}</div>
      {items.map(item => <div className={styles.container}>
        <strong>{item.label}</strong>
        <span>{item.value}</span>
      </div>
      )}
    </div>
  );
}

Summary.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  className: PropTypes.string,
};
