
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
  const { icon, size, className, style, type, pulse, badgeText, onClick } = props;

  const classes = classNames(className, `fa-${icon}`, styles.icon, typeMap[type], {
    'fa-pulse': pulse,
    [styles.pulse]: pulse,
  });

  const finalStyles = Object.assign({}, { fontSize: `${size}em` }, style);

  return badgeText ? (
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
  ) : (
    <i
      className={classes}
      data-test-id={props['data-test-id']}
      style={finalStyles}
      onClick={onClick}
    />
  );
}

Icon.defaultProps = {
  size: 1,
  type: 'light',
};

Icon.propTypes = {
  icon: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.string),
  'data-test-id': PropTypes.string,
  badgeText: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  pulse: PropTypes.bool,
};
