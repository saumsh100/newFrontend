
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

/**
 * If the text is longer than 200 characters,
 * slice the text and add an ellipsis.
 *
 * @param {string} value
 */
const ellipsisText = (value, delimiter) =>
  (value.length > delimiter ? `${value.slice(0, delimiter)}...` : value);

/**
 * Renders the title, value and edit button for the provided data.
 *
 * @param {string} key
 * @param {string} value
 * @param {string} link
 * @param {object} history
 * @param {object} location
 */
const SummaryItem = ({ label, value }) => (
  <div className={styles.waitlistIndex}>
    <span className={styles.waitlistKey}>{label}</span>
    <span className={styles.waitlistValue}>
      {typeof value === 'string' ? <p>{ellipsisText(value, 200)}</p> : value}
    </span>
  </div>
);

SummaryItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

/**
 * Factory function to create a SummaryItem with location and history injected
 *
 * @param {object} history
 * @param {object} location
 */
export const SummaryItemFactory = ({ location, history }) => {
  const Wrapped = props => <SummaryItem {...props} location={location} history={history} />;
  Wrapped.displayName = 'SummaryItemFactory';
  return Wrapped;
};

export default SummaryItem;
