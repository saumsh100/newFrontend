import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '../../../../../../components/library';
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
  count: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

MyFollowUpsButton.defaultProps = {
  count: 0,
};

export default MyFollowUpsButton;
