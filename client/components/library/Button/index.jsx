
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getClassMapper } from '../../Utils';
import { isHub } from '../../../util/hub';
import styles from './vbutton.scss';

const scheme = [
  ['size', ['sm', 'md', 'lg', 'xlg']],
  [
    'color',
    ['white', 'red', 'grey', 'green', 'blue', 'yellow', 'darkgrey', 'darkblue'],
  ],
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

  'disabled',
];

const mapper = getClassMapper(scheme, styles);

function Button(props) {
  const baseClassName = mapper.map(props, styles.baseline, props.className);
  let finalProps = mapper.omit(
    props,
    'as',
    'icon',
    'submit',
    'iconRight',
    'iconRightComponent',
    'isPristine',
  );

  if (props.disabled) {
    finalProps = mapper.omit(finalProps, 'onClick');
    finalProps.type = 'button';
  }

  const IconRightComponent = props.iconRightComponent || null;

  return (
    <props.as
      type="button"
      {...finalProps}
      className={classNames(baseClassName, {
        [styles.hub]: isHub(),
      })}
    >
      {props.icon && <i className={`fa fa-${props.icon} ${styles.icon}`} />}

      {props.children ||
        (props.title && (
          <span className={styles.text}>{props.children || props.title}</span>
        ))}

      {IconRightComponent && (
        <IconRightComponent className={styles.iconRight} />
      )}

      {props.iconRight && (
        <i className={`fa fa-${props.iconRight} ${styles.iconRight}`} />
      )}
    </props.as>
  );
}

Button.propTypes = {
  ...mapper.types(),
  children: PropTypes.node.isRequired,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  icon: PropTypes.string,
  iconRight: PropTypes.string,
  iconRightComponent: PropTypes.func,
  title: PropTypes.string,
};

Button.defaultProps = {
  as: 'button',
  className: '',
  icon: '',
  iconRight: '',
  iconRightComponent: undefined,
  title: '',
};

export default Button;
