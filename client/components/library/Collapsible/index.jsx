import React, { Component, PropTypes } from 'react';
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
    } = this.props;

    const showCollapsed = this.state.isCollapsed ? children : null;

    return (
      <div onClick={this.setCollapsed}>
        {showCollapsed}
      </div>
    );
  }
}

Collapsible.PropTypes = {
  children: PropTypes.node,
}
export default Collapsible;


