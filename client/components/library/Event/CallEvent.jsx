
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

export default function CallEvent(props) {
  const {
    data,
  } = props;

  return (
    <div className={styles.call}>
      <div className={styles.call_header}>
        Phone Call
      </div>
      <div>
        <audio controls>
          <source src={data.recording} type="audio/ogg" />
        </audio>
      </div>
      <div className={styles.call_subHeaderItalic}>
        {data.duration} seconds, from {data.callerCity}, at {moment(data.startTime).format('h:mm a')}
      </div>
    </div>
  );
}

CallEvent.propTypes = {
  data: PropTypes.object,
};
