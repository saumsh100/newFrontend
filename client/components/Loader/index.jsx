import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from '../../styles/default.scss';

class Loader extends React.Component {
  render() {
    if (!this.props.isLoaded) {
      const barStyle = this.props.inContainer ? classNames(styles.loadBar, styles.barInContainer) : styles.loadBar;

      return (
        <div className={barStyle}>
          <div className={styles.bar} />
          <div className={styles.bar} />
          <div className={styles.bar} />
        </div>
      );
    }

    return this.props.children;
  }
}

Loader.propTypes = {
  isLoaded: PropTypes.bool,
  inContainer: PropTypes.bool,
  children: PropTypes.node,
};

export default Loader;
