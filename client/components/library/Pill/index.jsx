
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.scss';

function Pill({
  selected, pillId, title, onClick,
}) {
  const className = classnames(
    styles.pill,
    selected ? styles.selectedPill : null,
  );

  return (
    <span className={className} onClick={() => onClick(pillId)}>
      {title}
    </span>
  );
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
