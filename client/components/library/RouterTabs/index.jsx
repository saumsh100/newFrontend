
import React, { Component } from 'react';
import Tabs, { Tab } from '../Tabs';

class RouterTabs extends Component {
  constructor(props) {
    super(props);

    this.handleRouterTabChange = this.handleRouterTabChange.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
  }

  handleRouterTabChange(index) {
    const route = this.props.route[index];
  }

  renderChildren(routes) {
    const tabElements = routes.map((item, idx) => {
      return React.cloneElement(item, {
        key: idx,
        active: this.props.index === idx,
        tabIndex: idx,
      });
    });

    return contentElements.filter((item, idx) => (idx === this.props.index));
  }

  render() {
    const { location, routes } = this.props;
    // TODO: location should dictate index
    const index = 0;
    return (
      <Tabs index={index} onChange={this.handleRouterTabChange}>
        {this.renderChildren(routes)}
      </Tabs>
    );
  }
}

RouterTabs.propTypes = {
  location: PropTypes.string.isRequired,
};

export default RouterTabs;
