
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Social from '../components/Social';

class SocialContainer extends Component {
  render() {
    return (
      <div>
        <Social {...this.props} />
      </div>
    );
  }
}

SocialContainer.propTypes = {
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

export default enhance(SocialContainer);
