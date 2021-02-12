
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '..';
import { ArrowIcon } from './Icons';
import styles from './navbar.scss';
import { getFormattedDate } from '../util/datetime';

const Navbar = ({
  onPreviousClick,
  onNextClick,
  toggleDrawer,
  isDrawerExpanded,
  month,
  timezone,
}) => (
  <div className={styles.top}>
    <div className={styles.container}>
      <div className={styles.nav}>
        <Button className={styles.prev} onClick={onPreviousClick}>
          <ArrowIcon />
        </Button>
        <h3 className={styles.month}>{getFormattedDate(month, 'MMMM, Y', timezone)}</h3>
        <Button className={styles.next} onClick={onNextClick}>
          <ArrowIcon />
        </Button>
      </div>
    </div>
    <div className={styles.schedule}>
      <Button
        onClick={toggleDrawer}
        className={classNames(styles.showDrawer, { [styles.active]: isDrawerExpanded })}
      >
        {isDrawerExpanded ? 'Hide' : 'Show'} Details
      </Button>
    </div>
  </div>
);

Navbar.propTypes = {
  isDrawerExpanded: PropTypes.bool.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onPreviousClick: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  month: PropTypes.instanceOf(Date),
};

Navbar.defaultProps = { month: new Date() };

export default Navbar;
