import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

export default function NewPatientEvent(props) {
  const {
    data,
  } = props;

  return (
    <div className={styles.body}>
      <div className={styles.body_header}>
        {data.firstName} {data.lastName} was created on {moment(data.createdAt).format('MMMM Do, YYYY')}.
      </div>
    </div>
  );
}

NewPatientEvent.propTypes = {
  data: PropTypes.object,
};