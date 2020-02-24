
import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '../../library';
import styles from './styles.scss';

const MyFollowUpsButton = ({ count, onClick }) => (
  <IconButton
    icon="clipboard"
    className={styles.myFollowUpsButtonWrapper}
    iconClassName={styles.myFollowUpsIcon}
    onClick={onClick}
    badgeText={count}
  />
);

MyFollowUpsButton.propTypes = {
  count: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MyFollowUpsButton;
