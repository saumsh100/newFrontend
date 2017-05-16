
import React, { Component, PropTypes } from 'react';
import Textarea from 'react-textarea-autosize';
import styles from './styles.scss';

class TextArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      label,
      input,
    } = this.props;

    return (
      <div>
        <div className={styles.label}>{label}</div>
        <Textarea
          {...this.props}
        />
      </div>
    );
  }
}

export default TextArea;
