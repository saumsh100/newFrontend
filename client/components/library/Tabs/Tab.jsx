
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

class Tab extends Component {

  render() {
    const {
      className,
      activeClassName,
      index,
      label,
      active,
      onClick,
      disabled,
    } = this.props;

    let classes = classNames(className, styles.tab);
    if (active) {
      classes = classNames(classes, activeClassName, styles.activeTab);
    }

    if (disabled) {
      classes = classNames(classes, styles.disabledTab);
    }

    return (
      // Order is important, classNames={classes} needs to override props.className
      <label
        className={classes}
        onClick={e => onClick(e, index)}
        data-test-id={this.props['data-test-id']}
      >
        {label}
      </label>
    );
  }
}

Tab.propTypes = {
  index: PropTypes.number,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Tab;
