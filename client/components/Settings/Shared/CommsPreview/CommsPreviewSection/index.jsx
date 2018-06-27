
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

function CommsPreviewTitle({ title }) {
  return <div className={styles.commsPreviewTitle} />;
}

class CommsPreviewSection extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <div className={styles.commsPreviewSection}>
        {title ? <CommsPreviewTitle title={title} /> : null}
        <div>{children}</div>
      </div>
    );
  }
}

CommsPreviewSection.propTypes = {
  title: PropTypes.string,
};

CommsPreviewSection.defaultProps = {};

export default CommsPreviewSection;
