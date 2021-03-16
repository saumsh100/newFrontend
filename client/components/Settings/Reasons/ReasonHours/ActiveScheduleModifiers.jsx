import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { sort } from '@carecru/isomorphic';
import { Button } from '../../../library';
import styles from '../../../library/ScheduleCalendar/modal.scss';
import ui from '../../../../styles/ui-kit.scss';

const ActiveScheduleModifiers = ({ active, data, addTimeItem, children }) =>
  active !== 'isClosed' && (
    <div className={styles.groupWrapper}>
      <span className={ui.modal__label}>
        {active === 'breaks' ? 'Except During these Times' : 'Availability'}
      </span>
      {data[active]
        .sort(({ startTime: a }, { startTime: b }) => sort()(a, b))
        .map((option, index) => (
          <div className={ui.modal__group} key={uuid()}>
            {children(option, index)}
          </div>
        ))}
      <Button onClick={() => addTimeItem(active)} className={ui.modal__add__button}>
        {active === 'breaks' ? 'Add Time Off' : 'Add Start Time'}
      </Button>
    </div>
  );

ActiveScheduleModifiers.propTypes = {
  active: PropTypes.string.isRequired,
  addTimeItem: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    isClosed: PropTypes.bool,
  }).isRequired,
};

export default ActiveScheduleModifiers;
