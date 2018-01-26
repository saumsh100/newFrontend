
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default function ChairHeader(props) {
  const {
    scheduleView,
    chair
  } = props;

  return (
    <div className={styles.chairContainer}>
      {chair.name}
    </div>
  );
}

ChairHeader.propTypes = {
  scheduleView: PropTypes.string,
  chair: PropTypes.object,
};
