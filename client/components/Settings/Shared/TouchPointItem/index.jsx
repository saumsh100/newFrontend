
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import {
  Grid,
  Row,
  Col,
} from '../../../library';
import styles from './styles.scss';

export function TouchPointLabel(props) {
  const classes = classNames(props.className, styles.reminderLabel);
  return (
    <div className={classes}>
      {props.title}
    </div>
  );
}

export default function TouchPointItem(props) {
  const {
    toggleComponent,
    labelComponent,
    mainComponent,
    rightComponent,
    selected,
    color,
    noLines,
    toggleClass,
    labelClass,
    linesBoxClass,
    connectLinesClass,
    ...otherProps,
  } = props;

  const { className } = otherProps;
  const finalProps = omit(otherProps, ['className']);

  return (
    <div
      className={classNames(className, styles.listItem)}
      {...finalProps}
    >
      <div className={styles.gridSection}>
        <div className={styles.leftSection}>
          <div className={classNames(toggleClass, styles.toggleCol)}>
            {toggleComponent}
          </div>
          <div className={classNames(labelClass, styles.labelCol)}>
            {labelComponent}
          </div>
        </div>
        <div className={styles.flexSection}>
          <div className={classNames(linesBoxClass, noLines ? classNames(styles.linesBox, selected ? styles[`boxSelected_${color}`] : {}) : (selected ? styles[`linesBoxSelected_${color}`] : styles.linesBoxWithLines))}>
            {mainComponent}
            {/*<div className={styles.downIconWrapper}>
                  <Icon icon="caret-down" size={2} />
                </div>*/}
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={classNames(connectLinesClass, selected ? styles[`connectionLineSelected_${color}`] : styles.connectionLine)}>
            {rightComponent}
          </div>
        </div>
      </div>
    </div>
  );
}

TouchPointItem.propTypes = {
  toggleComponent: PropTypes.element,
  labelComponent: PropTypes.element,
  mainComponent: PropTypes.element,
  rightComponent: PropTypes.element,
  selected: PropTypes.bool,
  noLines: PropTypes.bool,
  color: PropTypes.string,
};

TouchPointItem.defaultProps = {
  color: 'green',
};
