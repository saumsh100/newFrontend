
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
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
          <div className={styles.title}>
            <span>{alert.type}!</span>
          </div>
          <div>{alert.text}</div>
        </div>
        <div className={styles.iconContainer}>
          <IconButton
            icon="times"
            size={0.5}
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

// TODO: PropTypes!

export default Alert;
