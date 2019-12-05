
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(err) {
    console.error('@carecru/error in getDerivedStateFromError', err);
    return { hasError: true };
  }

  componentDidCatch(err, info) {
    console.error('@carecru/error in componentDidCatch', err, info);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <div>Error!</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
