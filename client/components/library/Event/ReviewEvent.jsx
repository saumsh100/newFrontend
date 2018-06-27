
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default function ReviewEvent(props) {
  const { data, bodyStyle } = props;

  return (
    <div className={bodyStyle}>
      <div className={styles.body_header}>Review Left from CareCru</div>
      <div className={styles.body_subHeader}>{data.description}</div>
    </div>
  );
}

ReviewEvent.propTypes = {
  data: PropTypes.object,
  bodyStyle: PropTypes.object,
};
