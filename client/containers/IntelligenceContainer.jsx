
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Intelligence from '../components/Intelligence';

class IntelligenceContainer extends Component {
  render() {
    return (
      <div>
        <Intelligence {...this.props} />
      </div>
    );
  }
}

IntelligenceContainer.propTypes = {
  fetchEntities: PropTypes.func,
  openForm: PropTypes.func,
};

function mapStateToProps({ entities }) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(IntelligenceContainer);
