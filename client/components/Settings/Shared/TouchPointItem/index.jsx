
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

export default function TouchPointItem(props) {
  const {
    toggleComponent,
    labelComponent,
    mainComponent,
    rightComponent,
    selected,
    color,
    noLines,
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
          <Col xs={1} className={styles.toggleCol}>
            {toggleComponent}
          </Col>
          <Col xs={3} className={styles.labelCol}>
            {labelComponent}
          </Col>
          <Col xs={7}>
            <div className={noLines ? null : (selected ? styles.linesBoxSelected : styles.linesBox)}>
              {mainComponent}
              {/*<div className={styles.downIconWrapper}>
                  <Icon icon="caret-down" size={2} />
                </div>*/}
            </div>
          </Col>
          <Col xs={1}>
            <div className={selected ? styles.connectionLineSelected : styles.connectionLine}>
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
