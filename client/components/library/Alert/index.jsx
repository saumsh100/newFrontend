
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import Icon from '../Icon';
import styles from './styles.scss';

class Alert extends Component {
  constructor(props) {
    super(props);
    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(e) {
    e.stopPropagation();
    this.props.alert.action();
  }

  render() {
    const {
      alert,
      hideAlert,
    } = this.props;

    let alertStyle = styles.alert;
    alertStyle = classNames(styles[`alert--${alert.status}--${alert.type}`], alertStyle);

    let iconStyle = styles.iconContainer;
    iconStyle = classNames(styles[`${alert.type}Hover`], iconStyle);

    return (
      <div className={alertStyle} >
        <div className={styles.textContainer} onClick={this.handleAction}>
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
}

Alert.propTypes = {
  alert: PropTypes.object.isRequired,
  hideAlert: PropTypes.func.isRequired,
};

export default Alert;
