
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

class Tab extends Component {
  constructor(props) {
    super(props);
    
    //this.parseChildren = this.parseChildren.bind(this);
    //this.renderHeaders = this.renderHeaders.bind(this);
    //this.renderContent = this.renderContent.bind(this);
  }
  
  render() {
    const {
      children,
      className,
      index,
      label,
      active,
      onClick,
      disabled,
    } = this.props;
    
    let classes = classNames(className, styles.tab);
    if (active) {
      classes = classNames(classes, styles.activeTab);
    }

    if (disabled) {
      classes = classNames(classes, styles.disabledTab);
    }
    
    return (
      // Order is important, classNames={classes} needs to override props.className
      <label
        className={classes}
        onClick={e => onClick(e, index)}
      >
        {label}
      </label>
    );
  }
}

Tab.propTypes = {
  index: PropTypes.number,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Tab;
