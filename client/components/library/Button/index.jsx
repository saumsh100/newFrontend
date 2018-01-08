
import React from 'react';
import PropTypes from 'prop-types';
import { getClassMapper } from '../../Utils';
import styles from './vbutton.scss';

const scheme = [
  ['size', ['sm', 'md', 'lg', 'xlg']],
  ['color', ['white', 'red', 'grey', 'green', 'blue', 'yellow', 'darkgrey', 'darkblue']],
  ['border', ['blue']],

  'primary',
  'secondary',
  'tertiary',

  'dense',

  'rounded',
  'upperCase',
  'compact',
  'raised',
  'flat',
  'bordered',

  'positive',
  'negative',
  'fluid',
];

const mapper = getClassMapper(scheme, styles);

const Button = props => (
  <props.as
    {...mapper.omit(props, 'as', 'icon', 'submit', 'iconRight')}
    className={mapper.map(props, styles.baseline, props.className)}
  >
    { props.icon ? (
      <i className={`fa fa-${props.icon} ${styles.icon}`} />
    ) : null }

    { (props.children || props.title) ? (
      <span className={styles.text}>{props.children || props.title}</span>
    ) : null }

    { props.iconRight ? (
      <i className={`fa fa-${props.iconRight} ${styles.iconRight}`} />
    ) : null }
  </props.as>
);

Button.defaultProps = {
  as: 'button',
};

Button.propTypes = {
  ...mapper.types(),
  children: PropTypes.node,
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),

  className: PropTypes.string,
  icon: PropTypes.string,
  iconRight: PropTypes.string,
  title: PropTypes.string,
};

export default Button;
