
import React from 'react';
import { omit } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Card(props) {
  const {
    children,
    className,
    noBorder,
  } = props;

  let classes = classNames(className, styles.card);

  if (noBorder) {
    classes = classNames(classes, styles.noBorder);
  }

  const newProps = omit(props, ['noBorder', 'className']);

  return (
    // Order is important, classNames={classes} needs to override props.className
    <div {...newProps} className={classes}>
      {children}
    </div>
  );
}

Card.propTypes = {
  noBorder: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
