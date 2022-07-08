import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Icon, Divider } from '..';
import { ArrowIcon } from './Icons';
import styles from './navbar.scss';
import { getFormattedDate } from '../util/datetime';
import SetCustomToggle from '../../Settings/Practitioners/PractitionerTabs/PractitionerOfficeHours/SetCustomToggle';

const Navbar = ({
  onPreviousClick,
  onNextClick,
  toggleDrawer,
  isDrawerExpanded,
  month,
  timezone,
  handleCreateCustomSchedule,
  handleRemoveOverrideHours,
  baseSchedule,
}) => (
  <div className={styles.top}>
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <h3 className={styles.month}>{getFormattedDate(month, 'MMMM, Y', timezone)}</h3>
        <div className={styles.nav}>
          <div
            tabIndex={0}
            className={styles.prev}
            onClick={onPreviousClick}
            onKeyDown={(e) => e.keyCode === 13 && onPreviousClick}
            role="button"
          >
            <ArrowIcon />
          </div>
          <div
            tabIndex={0}
            className={styles.next}
            onClick={onNextClick}
            onKeyDown={(e) => e.keyCode === 13 && onPreviousClick}
            role="button"
          >
            <ArrowIcon />
          </div>
        </div>
      </div>
      <div className={styles.schedule}>
        <SetCustomToggle
          baseSchedule={baseSchedule}
          handleCreateCustomSchedule={handleCreateCustomSchedule}
          handleRemoveOverrideHours={handleRemoveOverrideHours}
        />
        <Divider vertical className={styles.divider} />
        <Button
          onClick={toggleDrawer}
          className={classNames(styles.showDrawer, { [styles.active]: isDrawerExpanded })}
        >
          {isDrawerExpanded ? (
            <>
              <Icon icon="eye-slash" className={styles.DetailsIcon} />
              Hide Details
            </>
          ) : (
            <>
              <Icon icon="eye" className={styles.DetailsIcon} /> Show Details
            </>
          )}{' '}
        </Button>
      </div>
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
  handleCreateCustomSchedule: PropTypes.func.isRequired,
  handleRemoveOverrideHours: PropTypes.func.isRequired,
  baseSchedule: PropTypes.shape.isRequired,
};

Navbar.defaultProps = { month: new Date() };

export default Navbar;
