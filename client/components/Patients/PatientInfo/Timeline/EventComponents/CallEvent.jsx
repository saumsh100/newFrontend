
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import EventContainer from './Shared/EventContainer';

export default function CallEvent({ data }) {
  const callerCityText = data.callerCity && `from: ${data.callerCity}`;

  const component = (
    <div className={styles.call}>
      <div className={styles.call_header}>{data.firstName} called the practice.</div>
      <div>
        {/* eslint-disable */}
        <audio controls>
          <source src={data.recording} type="audio/ogg" />
        </audio>
      </div>
      <div className={styles.call_subHeaderItalic}>{callerCityText}</div>
    </div>
  );

  return <EventContainer key={data.id} component={component} />;
}

CallEvent.propTypes = {
  data: PropTypes.shape({
    duration: PropTypes.number,
    callerCity: PropTypes.string,
    startTime: PropTypes.string,
  }).isRequired,
};
