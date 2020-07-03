
import React from 'react';
import PropTypes from 'prop-types';
import fetchAvailableForms from '../../../../thunks/forms';

export default class FetchAvailableForms extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      forms: null,
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const forms = await fetchAvailableForms({ accountId: this.props.accountId });
    this.setState({
      isLoading: false,
      forms,
    });
  }

  render() {
    const { isLoading, forms } = this.state;

    return this.props.render({ isLoading,
      forms });
  }
}

FetchAvailableForms.propTypes = {
  accountId: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};
