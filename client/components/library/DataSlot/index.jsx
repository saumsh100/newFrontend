import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../../Widget/components/Button';
import styles from './styles.scss';

/**
 * Renders a slot of data inside a Button.
 *
 * @param {*} props
 */
export default function DataSlot(props) {
  const { type, selected, option, onClick, theme, children } = props;

  const className = classNames(styles.optionListItem, theme.slotButton, {
    [theme.selectedListItem || styles.selectedListItem]: selected,
  });
  return (
    <Button
      type={type}
      onClick={onClick}
      tabIndex="-1"
      className={className}
      data-test-id={option.value}
    >
      {children || <div className={styles.optionDiv}>{option.label}</div>}
    </Button>
  );
}

DataSlot.defaultProps = {
  type: 'button',
  theme: {},
  selected: false,
  children: null,
};

DataSlot.propTypes = {
  type: PropTypes.string,
  children: PropTypes.element,
  onClick: PropTypes.func.isRequired,
  option: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool,
  theme: PropTypes.shape({
    slotButton: PropTypes.string,
  }),
};
