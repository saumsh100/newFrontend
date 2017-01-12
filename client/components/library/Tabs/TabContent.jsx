
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

class TabContent extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {
      children,
      className,
      label,
    } = this.props;
    
    return (
      // Order is important, classNames={classes} needs to override props.className
      <div>
        {children}
      </div>
    );
  }
}

TabContent.propTypes = {
  children: PropTypes.object,
};

export default TabContent;
