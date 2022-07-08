import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { getFormattedDate, Icon } from '../../../../library';
import { patientShape } from '../../../../library/PropTypeShapes';
import eventHashMap from './Shared/eventHashMap';
import styles from './styles.scss';

function Event(props) {
  const { type, data, patient, timezone, event, order, length } = props;

  const content = eventHashMap[type];
  if (!content) return false;
  const iconType = 'solid';
  const { component, icon, iconColor } = content;

  return (
    <div className={styles.eventWrapper}>
      <div className={styles.event}>
        <div className={styles.iconContainer}>
          <div
            className={classnames(styles.verticalLine, {
              [styles.verticalLine_invisible]: order === 0,
            })}
          />
          <div className={classnames(styles.bgIcon, { [styles[`${iconColor}Border`]]: iconColor })}>
            <Icon size={1} icon={icon(data)} className={styles.icon} type={iconType} />
          </div>
          <div
            className={classnames(styles.verticalLine, {
              [styles.verticalLine_invisible]: length === order + 1,
            })}
          />
        </div>
        {component.map((EventComponent) => {
          return (
            <EventComponent
              data={data}
              key={data.id}
              patient={patient}
              timezone={timezone}
              event={event}
            />
          );
        })}
      </div>
      {type !== 'appointment' && type !== 'dueDate' && (
        <div className={styles.time}>
          <span className={styles.time_text}>
            {getFormattedDate(data.createdAt, 'h:mma', timezone)}
          </span>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(Event);

Event.propTypes = {
  type: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  patient: PropTypes.shape(patientShape).isRequired,
  event: PropTypes.objectOf(PropTypes.any).isRequired,
  order: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
};
