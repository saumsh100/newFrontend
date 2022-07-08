/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './reskin-styles.scss';

const typeMap = {
  light: 'fal',
  solid: 'fas',
  regular: 'far',
  brand: 'fab',
};

export default function Icon(props) {
  const { icon, className, type, pulse, badgeText, onClick } = props;

  const classes = classNames(className, `fa-${icon}`, styles.icon, typeMap[type], {
    'fa-pulse': pulse,
    [styles.pulse]: pulse,
  });

  return badgeText ? (
    <div className={styles.iconWrapper}>
      <i className={classes} data-test-id={props['data-test-id']} onClick={onClick} />
      <div
        className={classNames(styles.badgeWrapper, {
          [styles.largeBadge]: badgeText === '99+',
        })}
      >
        <span className={styles.badge}>{badgeText}</span>
      </div>
    </div>
  ) : (
    <i className={classes} data-test-id={props['data-test-id']} onClick={onClick} />
  );
}

Icon.defaultProps = {
  type: 'light',
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  className: PropTypes.string.isRequired,
  'data-test-id': PropTypes.string.isRequired,
  badgeText: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]).isRequired,
  pulse: PropTypes.bool.isRequired,
};
