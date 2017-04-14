import React, { Component, PropTypes } from 'react';
import Icon from '../Icon';
import styles from './styles.scss';

class Collapsible extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isCollapsed: false,
    };
    this.setCollapsed = this.setCollapsed.bind(this);
  }

  setCollapsed() {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    });
  }

  render() {
    const {
      children,
      title,
    } = this.props;

    const showCollapsed = this.state.isCollapsed ? children : null;
    const icon = this.state.isCollapsed ? 'minus' : 'plus';

    return (
      <div className={styles.collapsibleContainer}>
        <div className={styles.title} onClick={this.setCollapsed}>
          {title}
          <Icon icon={icon} className={styles.icon} />
        </div>
        <div className={styles.collapsed}>
          {showCollapsed}
        </div>
      </div>
    );
  }
}

Collapsible.PropTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
}
export default Collapsible;

