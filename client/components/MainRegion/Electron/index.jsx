
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import { TOOLBAR_RIGHT, TOOLBAR_LEFT } from '../../../util/hub';

export default function MainRegion({ children, position }) {
  return (
    <div
      className={classNames(styles.sectionContainer, {
        [styles.leftContainer]: position === TOOLBAR_LEFT,
        [styles.borderBottomRight]: position === TOOLBAR_LEFT,
        [styles.borderBottomLeft]: position === TOOLBAR_RIGHT,
      })}
    >
      {children}
    </div>
  );
}

MainRegion.propTypes = {
  children: PropTypes.node,
  position: PropTypes.string,
};
