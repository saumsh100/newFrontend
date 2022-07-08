import React from 'react';
import PropTypes from 'prop-types';
import styles from './reskin-styles.scss';

export default function ChairHeader(props) {
  const { chair } = props;

  return (
    <div className={styles.chairContainer}>
      <img src="images/icons/chair-office.svg" alt="office chair icon" />
      <p>{chair.name}</p>
    </div>
  );
}

ChairHeader.propTypes = {
  chair: PropTypes.shape.isRequired,
};
