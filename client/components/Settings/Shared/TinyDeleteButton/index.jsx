
import React from 'react';
import ClassyDiv from '../../../library/util/ClassyDiv';
import styles from './styles.scss';

const RedButton = ClassyDiv(styles.tinyDeleteButton);

export default (props) => <RedButton children="-" {...props} />;


