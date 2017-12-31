
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

class Tab extends Component {
  render() {
    const {
      className,
      index,
      label,
      active,
      onClick,
      disabled,
      noUnderLine,
      activeClass,
      inactiveClass,
    } = this.props;

    let classes = classNames(className, styles.tab);
    if (active) {
      classes = classNames(classes, activeClass, styles.activeTab);
    } else {
      classes = classNames(classes, inactiveClass);
    }

    if (noUnderLine) {
      classes = classNames(classes, styles.noUnderLine);
    }

    if (disabled) {
      classes = classNames(classes, styles.disabledTab);
    }

    if (active) console.log('Active:', label, 'Class:', classes);

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
  label: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Tab;
