
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import Icon from '../Icon';
import styles from './styles.scss';

class Alert extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      alert,
      hideAlert,
    } = this.props;

    let alertStyle = styles.alert;
    if (alert.status === 'show') {
      alertStyle = classNames(styles[`alert--${alert.status}--${alert.type}`], alertStyle);
    }

    let iconStyle = styles.iconContainer
    if (alert.status === 'show') {
      iconStyle = classNames(styles[`${alert.type}Hover`], iconStyle);
    }

    return (
      <div className={alertStyle}>
        <div className={styles.textContainer}>
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
              hideAlert();
            }}
          />
        </div>
      </div>
    );
  }
}

Alert.propTypes = {
  alert: PropTypes.object.required,
  hideAlert: PropTypes.func.required,
};

export default Alert;
