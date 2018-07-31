
import React from 'react';
import PropTypes from 'prop-types';
import dateFormatter from '../../../../iso/helpers/dateTimezone/dateFormatter';
import styles from './styles.scss';

export default function RequestEvent(props) {
  const { data, bodyStyle } = props;

  return (
    <div className={bodyStyle}>
      <div className={styles.body_header}>
        Online appointment requested for {dateFormatter(data.startDate, '', 'MMMM Do, YYYY h:mma')}
      </div>
      <div className={styles.body_subHeaderItalic}>{data.note || ''}</div>
    </div>
  );
}

RequestEvent.propTypes = {
  data: PropTypes.shape({
    startDate: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
  bodyStyle: PropTypes.string,
};

RequestEvent.defaultProps = {
  bodyStyle: '',
};
