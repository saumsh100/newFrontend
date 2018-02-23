
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
      fluid,
      onClick,
      disabled,
      noUnderLine,
      activeClass,
      inactiveClass,
      id,
      tabCard,
    } = this.props;

    let classes = !tabCard ? classNames(className, styles.tab) : classNames(className, styles.tabCard);
    if (active) {
      classes = !tabCard ? classNames(classes, activeClass, styles.activeTab) : classNames(classes, activeClass, styles.activeTabCard);
    } else {
      classes = classNames(classes, inactiveClass);
    }

    if (noUnderLine) {
      classes = classNames(classes, styles.noUnderLine);
    }

    if (disabled) {
      classes = classNames(classes, styles.disabledTab);
    }

    if (fluid) {
      classes = classNames(classes, styles.fluidTab);
    }

    return (
      // Order is important, classNames={classes} needs to override props.className
      <label
        className={classes}
        onClick={e => onClick(e, index)}
        data-test-id={this.props['data-test-id']}
        id={id}
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
  fluid: PropTypes.bool,
};

export default Tab;
