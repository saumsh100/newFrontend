
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { dateFormatter } from '@carecru/isomorphic';
import { Icon } from '../../../../library';
import eventHashMap from './Shared/eventHashMap';
import styles from './styles.scss';

export default function Event(props) {
  const { type, data, patient } = props;

  const content = eventHashMap[type];
  if (!content) return;

  const iconType = 'solid';
  const { component, icon, iconColor } = content;

  return (
    <div className={styles.eventWrapper}>
      <div className={styles.event}>
        <div className={styles.iconContainer}>
          <div className={classnames(styles.bgIcon, { [styles[`${iconColor}Border`]]: iconColor })}>
            <Icon size={1} icon={icon(data)} className={styles.icon} type={iconType} />
          </div>
        </div>
        {component.map(EventComponent => (
          <EventComponent data={data} key={data.id} patient={patient} />
        ))}
      </div>
      {type !== 'appointment' && type !== 'dueDate' && (
        <div className={styles.time}>
          <span className={styles.time_text}>{dateFormatter(data.createdAt, '', 'h:mma')}</span>
        </div>
      )}
    </div>
  );
}

Event.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  patient: PropTypes.shape({}).isRequired,
};
