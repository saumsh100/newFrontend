
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from '../../Loader';

class RelayComponentRenderer extends Component {
  componentWillReceiveProps(nextProps) {
    const { handleUpdates, error, props } = nextProps;
    if (!handleUpdates || !props || error) return;

    handleUpdates(nextProps);
  }

  render() {
    const {
      render, error, props, ...parentProps
    } = this.props;
    if (error) {
      return <div>Error!</div>;
    }
    if (!props) {
      return <Loader />;
    }

    return render(Object.assign(parentProps, props));
  }
}
RelayComponentRenderer.propTypes = {
  render: PropTypes.func,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  props: PropTypes.shape({
    data: PropTypes.shape({}),
  }),
  handleUpdates: PropTypes.func,
};

export default RelayComponentRenderer;
