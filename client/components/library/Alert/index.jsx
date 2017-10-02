
import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import Icon from '../Icon';
import styles from './styles.scss';

export default function Alert(props) {
  const {
    alert,
    removeAlert,
    alertClick,
  } = props;

  let alertStyle = styles.alert;
  alertStyle = classNames(styles[`alert--${alert.type}`], alertStyle);

  const cursorStyle = alert && alert.clickable ? {
    cursor: 'pointer',
  } : {};

  let iconStyle = styles.iconContainer;
  iconStyle = classNames(styles[`${alert.type}Hover`], iconStyle);

  return (
    <div
      className={alertStyle}
      style={cursorStyle}
      onClick={alertClick}
    >
      <div className={styles.textContainer} >
        <div className={styles.title}>
          <span>{alert.title}!</span>
        </div>
        <div className={styles.alertBodyText}>{alert.body}</div>
        <div className={styles.alertBodyText}>{alert.subText}</div>
      </div>
      <div className={iconStyle}>
        <Icon
          icon="times"
          size={0.8}
          onClick={(e) => {
            e.stopPropagation();
            removeAlert({ alert });
          }}
        />
      </div>
    </div>
  );
}

Alert.propTypes = {
  alert: PropTypes.object.isRequired,
  removeAlert: PropTypes.func.isRequired,
  handleAction: PropTypes.func,
  alertClick: PropTypes.func,
};

