
import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router-dom';
import Tabs, { Tab } from '../Tabs';

class RouterTabs extends Component {
  constructor(props) {
    super(props);

    this.handleRouterTabChange = this.handleRouterTabChange.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
  }

  handleRouterTabChange(index) {
    const { to } = this.props.routes[index];
    this.props.history.push(to);
  }

  renderChildren(routes) {
    return routes.map(({ label, disabled }, idx) => {
      return (
        <Tab
          key={`${label}${idx}`}
          label={label}
          disabled={disabled}
        />
      );
    });
  }

  render() {
    const { location, routes } = this.props;
    const index = routes.findIndex(route => location.pathname.indexOf(route.to) === 0);
    return (
      <Tabs
        index={index}
        onChange={this.handleRouterTabChange}
        noUnderLine
      >
        {this.renderChildren(routes)}
      </Tabs>
    );
  }
}

RouterTabs.propTypes = {
  location: PropTypes.object,
  routes: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(RouterTabs);
