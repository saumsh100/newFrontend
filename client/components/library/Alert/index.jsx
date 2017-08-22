
import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import Icon from '../Icon';
import styles from './styles.scss';

export default function Alert(props) {
  const {
    alert,
    hideAlert,
  } = props;

  let alertStyle = styles.alert;
  alertStyle = classNames(styles[`alert--${alert.status}--${alert.type}`], alertStyle);

  let iconStyle = styles.iconContainer;
  iconStyle = classNames(styles[`${alert.type}Hover`], iconStyle);

  return (
    <div
      className={alertStyle}
    >
      <div className={styles.textContainer} >
        <div className={styles.title}>
          <span>{alert.title}!</span>
        </div>
        <div>{alert.body}</div>
      </div>
      <div className={iconStyle}>
        <Icon
          icon="times"
          size={0.8}
          onClick={(e) => {
            e.stopPropagation();
            hideAlert({ alert });
          }}
        />
      </div>
    </div>
  );
}

Alert.propTypes = {
  alert: PropTypes.object.isRequired,
  hideAlert: PropTypes.func.isRequired,
  handleAction: PropTypes.func,
};

