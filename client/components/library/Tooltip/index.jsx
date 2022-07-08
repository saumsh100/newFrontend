import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import RCTooltip from 'rc-tooltip';
import styles from './styles.scss';

export default function Tooltip(props) {
  const { className } = props;
  const classes = classNames(className, styles.tooltip);
  const newProps = {
    ...props,
    classes
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
