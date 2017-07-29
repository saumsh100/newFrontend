import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.scss';

class Pill extends PureComponent {

  render() {
    const className = classnames(styles.pill, this.props.selected ? styles.selectedPill : null);

    return (
      <button
        className={className}
        onClick={() => this.props.onClick(this.props.pillId)}
      >
        {this.props.title}
      </button>
    );
  }
}

Pill.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  pillId: PropTypes.string.isRequired,
};

Pill.defaultProps = {
  onClick: () => {},
  selected: false,
};

export default Pill;
