
import React, { Component, PropTypes } from 'react';
import classNames from 'classNames/bind';
import IconButton from '../IconButton';
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
    return (
      <div className={alertStyle}>
        <div className={styles.textContainer}>
          {alert.text}
        </div>
        <div className={styles.iconContainer}>
          <IconButton
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

export default Alert;
