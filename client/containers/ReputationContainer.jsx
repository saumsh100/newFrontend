
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReputationComponent from '../components/ReputationComponent';

class StarContainer extends Component {
  render() {
    return (
      <div>
        <ReputationComponent {...this.props} />
      </div>
    );
  }
}

StarContainer.propTypes = {
  fetchEntities: PropTypes.func,
  openForm: PropTypes.func,
};

function mapStateToProps({ entities }) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(StarContainer);
