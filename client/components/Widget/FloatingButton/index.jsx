
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default function FloatingButton({ children, visible }) {
  return (
    <CSSTransition
      timeout={{
        enter: 300,
        exit: 300,
      }}
      in={visible}
      classNames={styles}
      unmountOnExit
    >
      <div className={styles.floating}>{children}</div>
    </CSSTransition>
  );
}

FloatingButton.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
};
