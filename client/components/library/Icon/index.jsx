
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const typeMap = {
  light: 'fal',
  solid: 'fas',
  regular: 'far',
  brand: 'fab',
};

export default function Icon(props) {
  const { icon, size, className, onClick, style, type, pulse, badgeText } = props;

  const baseClass = typeMap[type];
  const fontAwesomeClass = `${baseClass} fa-${icon} ${styles.icon}`;
  let classes = classNames(className, fontAwesomeClass);
  if (pulse) {
    classes = classNames(classes, 'fa-pulse');
  }

  const finalStyles = Object.assign({}, { fontSize: `${size}em` }, style);

  if (!badgeText) {
    return (
      <i
        className={classes}
        data-test-id={props['data-test-id']}
        style={finalStyles}
        onClick={onClick}
      />
    );
  }

  return (
    <div className={styles.iconWrapper}>
      <i
        className={classes}
        data-test-id={props['data-test-id']}
        style={finalStyles}
        onClick={onClick}
      />
      <div className={styles.badgeWrapper}>
        <span className={styles.badge}>{badgeText}</span>
      </div>
    </div>
  );
}

Icon.defaultProps = {
  size: 1,
  type: 'light',
};

Icon.propTypes = {
  icon: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.shape({}),
  'data-test-id': PropTypes.string,
  badgeText: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  pulse: PropTypes.bool,
};
