
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ListItem } from '../../library';
import SuccessfulList from './SuccessfulList';

const OutboxItem = ({ styles, dateFormat, data }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);
  const { primaryType = 'email', lengthSeconds = '1 week', success, errors } = data;

  return (
    <div className={styles.listItemWrapper}>
      <ListItem className={styles.listItem} onClick={() => toggleExpanded()}>
        <div className={styles.col}>Type: {primaryType}</div>
        <div className={styles.col}>Length: {lengthSeconds}</div>
        <div className={styles.col}>Success: {success.length}</div>
        <div className={styles.col}>Fail: {errors.length}</div>
      </ListItem>
      {expanded ? (
        <SuccessfulList
          success={data.success}
          primaryType={data.primaryType}
          dateFormat={dateFormat}
          styles={styles}
        />
      ) : null}
    </div>
  );
};

export default OutboxItem;

OutboxItem.propTypes = {
  data: PropTypes.shape({
    success: PropTypes.arrayOf(PropTypes.any),
    errors: PropTypes.arrayOf(PropTypes.any),
    primaryType: PropTypes.string,
    lengthSeconds: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  styles: PropTypes.shape(PropTypes.any).isRequired,
  dateFormat: PropTypes.string.isRequired,
};
