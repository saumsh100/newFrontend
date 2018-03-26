
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';
import { Button } from '..';

/**
 * Renders a slot of time,
 * inside of a SuggestionDropdown.
 *
 * @param {*} props
 */
export default function DataSlot(props) {
  const { selected, option, onClick, theme } = props;

  const className = classNames(
    styles.optionListItem, theme.slotButton, {
      [styles.selectedListItem]: selected,
    }
  );
  return (
    <Button
      onClick={onClick}
      tabIndex="-1"
      className={className}
      data-test-id={option.value}
    >
      <div className={styles.optionDiv}>
        {option.label}
      </div>
    </Button>
  );
}

DataSlot.propTypes = {
  selected: PropTypes.bool,
  option: PropTypes.object,
  onClick: PropTypes.func,
};
