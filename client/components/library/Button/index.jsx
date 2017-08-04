
import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import omit from 'lodash/omit';
import styles from './styles.scss';
import Icon from '../Icon';

const cx = classNames.bind(styles);

export default function Button(props) {
  const classes = classNames(
    props.className,
    cx({
      default: true,
      flat: props.flat,
      notFlat: !props.flat,
      disabled: props.disabled,
      icon: props.icon,
    })
  );

  let iconComponent = null;
  if (props.icon) {
    iconComponent =
      <div className={styles.icon}>
        <Icon icon={props.icon} size={1} />
      </div>
  }

  const newProps = omit(props, ['flat', 'submit']);
  return (
    <button data-test-id={props['data-test-id']} {...newProps} className={classes}>
      <div className={styles.displayFlex}>
        {iconComponent}
        {props.children}
      </div>
    </button>
  );
}

Button.propTypes = {
  flat: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
};
