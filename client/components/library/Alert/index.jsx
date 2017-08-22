
import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import Icon from '../Icon';
import styles from './styles.scss';

export default function Alert(props) {
  const {
    alert,
    removeAlert,
  } = props;

  let alertStyle = styles.alert;
  alertStyle = classNames(styles[`alert--${alert.get('type')}`], alertStyle);

  let iconStyle = styles.iconContainer;
  iconStyle = classNames(styles[`${alert.get('type')}Hover`], iconStyle);

  return (
    <div
      className={alertStyle}
    >
      <div className={styles.textContainer} >
        <div className={styles.title}>
          <span>{alert.get('title')}!</span>
        </div>
        <div>{alert.get('body')}</div>
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
};

