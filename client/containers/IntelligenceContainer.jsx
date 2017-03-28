
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import IntelligenceComponent from '../components/IntelligenceComponent';

class IntelligenceContainer extends Component {
  render() {
    return (
      <div>
        <IntelligenceComponent {...this.props}/>
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
  return bindActionCreators({

  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(IntelligenceContainer);
