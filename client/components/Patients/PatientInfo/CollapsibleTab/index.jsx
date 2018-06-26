
import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from '../../../library';
import styles from './styles.scss';

export default function CollapsibleTab({ title, children }) {
  return (
    <Collapsible
      title={title}
      wrapperClass={styles.collapsibleWrapper}
      titleClass={styles.collapsibleTitle}
      contentClass={styles.collapsibleContent}
      activeClass={styles.collapsibleExpanded}
      openIcon="caret-down"
      closeIcon="caret-up"
    >
      {children}
    </Collapsible>
  );
}

CollapsibleTab.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};
