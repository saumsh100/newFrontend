
import React, { PropTypes } from 'react';
import ClassyDiv from '../util/ClassyDiv';
import styles from './styles.scss';

const SContainer = ClassyDiv(styles.container);
const SHeader = ClassyDiv(styles.header);
const SBody = ClassyDiv(styles.body);
const SFooter = ClassyDiv(styles.footer);

export {
  SContainer,
  SHeader,
  SBody,
  SFooter,
};
