
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '..';
import styles from './styles.scss';

/**
 * Renders a slot of data inside a Button.
 *
 * @param {*} props
 */
export default function DataSlot(props) {
  const { selected, option, onClick, theme, children } = props;

  const className = classNames(styles.optionListItem, theme.slotButton, {
    [styles.selectedListItem]: selected,
  });
  return (
    <Button onClick={onClick} tabIndex="-1" className={className} data-test-id={option.value}>
      {children || <div className={styles.optionDiv}>{option.label}</div>}
    </Button>
  );
}

DataSlot.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  option: PropTypes.object,
  selected: PropTypes.bool,
  theme: PropTypes.object,
};
