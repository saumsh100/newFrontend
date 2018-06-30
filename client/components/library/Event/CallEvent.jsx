
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

export default function CallEvent(props) {
  const { data, callStyle } = props;

  return (
    <div className={callStyle}>
      <div className={styles.call_header}>Phone Call</div>
      <div>
        <audio controls>
          <source src={data.recording} type="audio/ogg" />
        </audio>
      </div>
      <div className={styles.call_subHeaderItalic}>
        {data.duration} seconds, from {data.callerCity}, at{' '}
        {moment(data.startTime).format('h:mm a')}
      </div>
    </div>
  );
}

CallEvent.propTypes = {
  data: PropTypes.shape({
    duration: PropTypes.number,
    callerCity: PropTypes.string,
    startTime: PropTypes.string,
  }).isRequired,
  callStyle: PropTypes.string,
};

CallEvent.defaultProps = {
  callStyle: '',
};
