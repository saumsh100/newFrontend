
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
    runAnimation,
    loaded,
    loaderStyle,
  } = props;

  let classes = classNames(className, styles.card);
  const loadBarClass = classNames(loaderStyle, styles.loadBar)

  if (noBorder || (runAnimation && !loaded)) {
    classes = classNames(classes, styles.noBorder);
  }

  const newProps = omit(props, ['noBorder', 'className', 'runAnimation', 'loaded']);
  return (
    // Order is important, classNames={classes} needs to override props.className
    <div {...newProps} className={classes}>
      {runAnimation && !loaded ? <div className={loadBarClass}>
        <div className={styles.bar} />
        <div className={styles.bar} />
        <div className={styles.bar} />
      </div> : null}
      {children}
    </div>
  );
}

Card.propTypes = {
  noBorder: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
