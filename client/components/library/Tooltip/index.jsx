
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RCTooltip from 'rc-tooltip';
import styles from './styles.scss';

export default function Tooltip(props) {
  const { className } = props;
  const classes = classNames(className, styles.tooltip);
  const newProps = {
    ...props,
    className: classes,
  };

  return <RCTooltip {...newProps} />;
}

Tooltip.propTypes = {
  className: PropTypes.string,
  placement: PropTypes.string,
  trigger: PropTypes.array,
};

Tooltip.defaultProps = {
  placement: 'right',
  trigger: ['hover'],
};
