
import React, { PropTypes } from 'react';
import styles from '../styles.scss';

export default function CallerDisplay({ call, patient }) {
  if (!call) {
    return null;
  }

  const isAnswered = !call.answered;
  const isCallFinished = call.duration > 0;
  let background = null;

  if (!isAnswered) {
    // call rigging
    background = styles.notAnswered;
  } else if (isCallFinished && !isAnswered) {
    background = styles.ended;
  } else {
    background = styles.endedMissed;
  }
  return (
    <div className={background}>
      {call.id}
      {patient ? patient.id : null}
      {isAnswered ? 'call answered' : null}
      {isCallFinished ? 'call finished' : null}
    </div>
  );
}

CallerDisplay.propTypes = {
  call: PropTypes.object,
  patient: PropTypes.object,
};
