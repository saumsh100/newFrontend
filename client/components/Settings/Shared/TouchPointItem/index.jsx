
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
      <Grid>
        <Row>
          <Col xs={1} className={classNames(toggleClass, styles.toggleCol)}>
            {toggleComponent}
          </Col>
          <Col xs={4} className={classNames(labelClass, styles.labelCol)}>
            {labelComponent}
          </Col>
          <Col xs={6}>
            <div className={classNames(linesBoxClass, noLines ? styles.linesBox : (selected ? styles[`linesBoxSelected_${color}`] : styles.linesBoxWithLines))}>
              {mainComponent}
              {/*<div className={styles.downIconWrapper}>
                  <Icon icon="caret-down" size={2} />
                </div>*/}
            </div>
          </Col>
          <Col xs={1}>
            <div className={classNames(connectLinesClass, selected ? styles[`connectionLineSelected_${color}`] : styles.connectionLine)}>
              {rightComponent}
            </div>
          </Col>
        </Row>
      </Grid>
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
