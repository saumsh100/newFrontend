
import React, { Component, PropTypes } from 'react';
import Textarea from 'react-textarea-autosize';

class TextArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Textarea
        {...this.props}
      />
    );
  }
}

export default TextArea;
