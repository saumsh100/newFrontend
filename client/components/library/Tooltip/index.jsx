
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RCTooltip from 'rc-tooltip';
import styles from './styles.scss';

export default function Tooltip(props) {
  const {
    className,
    placement = 'right',
    trigger = ['hover'],
  } = props;
  
  const classes = classNames(className, styles.tooltip);

  return (
    <RCTooltip
      placement={placement}
      trigger={trigger}
      {...props}
      className={classes}
    />
  );
}

Tooltip.propTypes = {
  className: PropTypes.string,
  placement: PropTypes.string,
  trigger: PropTypes.array,
};
