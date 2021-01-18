
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const Item = ({ title, value, extra }) => (
  <div className={styles.item}>
    <div className={styles.title}>{title}</div>
    <div>{value}</div>
    {(extra || []).map(
      ({ extraTitle, extraValue }) =>
        extraValue && (
          <div className={styles.title}>
            {extraTitle} {extraValue}
          </div>
        ),
    )}
  </div>
);

Item.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  extra: PropTypes.arrayOf(
    PropTypes.shape({
      extraTitle: PropTypes.string,
      extraValue: PropTypes.string,
    }),
  ),
};

Item.defaultProps = {
  title: '',
  value: null,
  extra: [],
};

export default Item;
