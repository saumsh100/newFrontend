import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Content({ title, value, children, noMarginBottom }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <div
        className={classNames(styles.content, {
          [styles.noMarginBottom]: noMarginBottom,
        })}
      >
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
  noMarginBottom: PropTypes.bool,
};

Content.defaultProps = { children: () => null, noMarginBottom: false };
