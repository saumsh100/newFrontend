import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind';
import Icon from '../Icon';
import styles from './styles.scss';

export default function Alert(props) {
  const { alert, removeAlert, alertClick } = props;

  let alertStyle = styles.alert;
  alertStyle = classNames(styles[`alert--${alert.type}`], alertStyle);

  return (
    <div className={alertStyle}>
      <div className={styles.textContainer}>
        <div className={styles.title}>
        {alert.type === 'error' ? (
        <Icon icon="exclamation-triangle" type="solid" className={styles.errorIcon} />
      ) : (
        ''
      )}
          <span>{alert.title}</span>
        </div>
        <div className={classNames(alert.type === 'error' ? styles.errorAlertBodyText : styles.alertBodyText)}>{alert.body}</div>
        <div className={styles.alertBodyText}>{alert.subText}</div>
        {alert.clickable ? (
          <div className={styles.clickableLink}>
            <div onClick={alertClick}>Click to View</div>
          </div>
        ) : null}
      </div>
      <div>
        <Icon
          icon="times"
          size={0.8}
          className={styles.iconContainer}
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
  alertClick: PropTypes.func,
};
