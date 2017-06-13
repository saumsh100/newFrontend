import React from 'react';
import PropTypes from 'prop-types';
import { getClassMapper } from '../../Utils';
import styles from './vbutton.scss';

const scheme = [
  ['size', ['sm', 'md', 'lg', 'xlg']],
  ['color', ['red', 'grey', 'green', 'blue', 'yellow', 'darkgrey']],

  'rounded',
  'upperCase',
  'compact',

  'positive',
  'negative',
  'fluid',
];

const mapper = getClassMapper(scheme, styles);

const VButton = (props) => {
  return (
    <props.as
      {...mapper.omit(props, 'as', 'icon')}
      className={mapper.map(props, styles.default, props.className)}
    >
      { props.icon ? (
        <i className={`fa fa-${props.icon} ${styles.icon}`} />
      ) : null }

      { (props.children || props.title) ? (
        <span className={styles.text}>{props.children || props.title}</span>
      ) : null }
    </props.as>
  );
};

VButton.defaultProps = {
  as: 'button',
};

VButton.propTypes = {
  ...mapper.types(),
  children: PropTypes.node,
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  className: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
};

export default VButton;
