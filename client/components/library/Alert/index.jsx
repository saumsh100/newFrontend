
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
      index,
    } = this.props;

    let alertStyle = styles.alert;
    if (alert.status === 'show') {
      alertStyle = classNames(styles[`alert--${alert.status}--${alert.type}`], alertStyle);
    }

    let iconStyle = styles.iconContainer;
    if (alert.status === 'show') {
      iconStyle = classNames(styles[`${alert.type}Hover`], iconStyle);
    }

    const top = (70 * (index + 1)) + (50 * index);
    const styleTop = {
      top: `${top}px`,
    };

    return (
      <div className={alertStyle} style={styleTop}>
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
              hideAlert({ id: alert.id });
            }}
          />
        </div>
      </div>
    );
  }
}

Alert.propTypes = {
  alert: PropTypes.object.isRequired,
  hideAlert: PropTypes.func.isRequired,
};

export default Alert;
