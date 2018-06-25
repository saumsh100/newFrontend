
import React from 'react';
import PropTypes from 'prop-types';
import AddToWaitlistForm from '../../Schedule/Header/Waitlist/AddToWaitlist';
import styles from './styles.scss';

function AddToWaitlistPage({ onSubmit }) {
  return (
    <div className={styles.pageContainer}>
      <AddToWaitlistForm onSubmit={onSubmit} />
    </div>
  );
}

AddToWaitlistPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AddToWaitlistPage;
