import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntities } from '../thunks/fetchEntities';

class AdminContainer extends Component {
  componentWillMount() {
    const { match: { params: { enterpriseId, accountId } } } = this.props;

    if (enterpriseId) {
      this.props.fetchEntities({ key: 'enterprises' });
    }

    if (enterpriseId && accountId) {
      this.props.fetchEntities({ key: 'accounts', url: `/api/enterprises/${enterpriseId}/accounts` });
    }
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

AdminContainer.propTypes = {
  children: PropTypes.element.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      enterpriseId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  fetchEntities: PropTypes.func.isRequired,
};

const dispatchToProps = dispatch => bindActionCreators({
  fetchEntities,
}, dispatch);

export default connect(null, dispatchToProps)(AdminContainer);

