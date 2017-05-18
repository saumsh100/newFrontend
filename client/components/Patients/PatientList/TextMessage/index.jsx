
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class TextMessage extends Component {

  render() {
    //TODO Make messages page and remove inline styles.
    const style = {
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      height: '100%',
    };

    const style2 = {
      'max-width': '50%',
      'max-height': '50%',
    };

    return (
      <div style={style}>
        <div style={style2}>Coming Soon</div>
      </div>
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
