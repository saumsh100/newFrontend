
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

export default function NewPatientEvent(props) {
  const { data, bodyStyle } = props;
  return (
    <div className={bodyStyle}>
      <div className={styles.body_header}>
        {data.firstName} {data.lastName} was created on{' '}
        {moment(data.createdAt).format('MMMM Do, YYYY')}.
      </div>
    </div>
  );
}

NewPatientEvent.propTypes = {
  data: PropTypes.shape({
    createdAt: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  bodyStyle: PropTypes.string,
};

NewPatientEvent.defaultProps = {
  bodyStyle: null,
};
