
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class TextMessage extends Component {

  render() {

    return (
      <img src="http://images.mysafetysign.com/img/lg/S/under-construction-caution-sign-s-0816.png" height='100%' width='100%' />
        );
  }
}

TextMessage.PropTypes = {
};

function mapStateToProps({ entities }) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(TextMessage);
