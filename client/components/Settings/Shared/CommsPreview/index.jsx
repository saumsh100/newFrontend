
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommsPreviewSection from './CommsPreviewSection';
import styles from './styles.scss';

class CommsPreview extends Component {
  render() {
    return <div className={styles.commsPreview}>{this.props.children}</div>;
  }
}

CommsPreview.propTypes = {};
CommsPreview.defaultProps = {};

export default CommsPreview;
export { CommsPreviewSection };
