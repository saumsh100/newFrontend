import React from 'react';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LoadingBar from '../LoadingBar';
import styles from './reskin-styles.scss';

export default function Card(props) {
  const { children, className, noBorder, runAnimation, loaded, loaderStyle } = props;

  let classes = classNames(className, styles.card);

  if (noBorder || (runAnimation && !loaded)) {
    classes = classNames(classes, styles.noBorder);
  }

  const newProps = omit(props, ['noBorder', 'className', 'runAnimation', 'loaded', 'loaderStyle']);
  return (
    // Order is important, classNames={classes} needs to override props.className
    <div {...newProps} className={classes}>
      {runAnimation && !loaded ? <LoadingBar className={loaderStyle} /> : null}
      {children}
    </div>
  );
}

Card.propTypes = {
  noBorder: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  runAnimation: PropTypes.bool,
  loaded: PropTypes.oneOfType([PropTypes.bool, PropTypes.objectOf(PropTypes.any)]),
  loaderStyle: PropTypes.string,
};

Card.defaultProps = {
  noBorder: false,
  className: '',
  runAnimation: false,
  loaded: false,
  loaderStyle: '',
  children: null,
};
