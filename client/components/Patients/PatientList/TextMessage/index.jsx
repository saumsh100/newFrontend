
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class TextMessage extends Component {

  render() {
    const style = {
      backgroundColor: 'grey',
    };

    return (
      <div style={style} height='100%' width='100%' />
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
