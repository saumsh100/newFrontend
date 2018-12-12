
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { dateFormatter } from '@carecru/isomorphic';
import Icon from '../Icon';
import eventHashMap from './Shared/eventHashMap';
import styles from './styles.scss';

export default function Event(props) {
  const { type, data } = props;

  const iconType = 'solid';

  const content = eventHashMap[type];
  const { component, icon, iconColor } = content;

  return (
    content && (
      <div className={styles.eventWrapper}>
        <div className={styles.event}>
          <div className={styles.iconContainer}>
            <div
              className={classnames(styles.bgIcon, { [styles[`${iconColor}Border`]]: iconColor })}
            >
              <Icon size={1} icon={icon(data)} className={styles.icon} type={iconType} />
            </div>
          </div>
          {component.map(ev => ev({ data }))}
        </div>
        {type !== 'appointment' && type !== 'duedate' && type !== 'recall' && (
          <div className={styles.time}>
            <span className={styles.time_text}>{dateFormatter(data.createdAt, '', 'h:mm a')}</span>
          </div>
        )}
      </div>
    )
  );
}

Event.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};
