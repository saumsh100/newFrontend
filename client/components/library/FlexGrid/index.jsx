
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import { Col, Row } from '../Grid';
import Guage from '../Guage'
import chunk from 'lodash/chunk';

const FlexGrid = function (props) {
  const {
    items,
    title,
    children,
  } = props;
  const n = children.length > 3 ? 2 : 3;
  const width = Math.floor( 12 / n);
  const gridStyle = { width: '100%' };
  const renderChilden = chunk(children, n); 
  return (
    <Col xs={12} md={6} >
      <div style={gridStyle} className={styles.settingsFormsCol}>
        <div className={styles.sideByside} >
          <div className={styles.sideByside__title}>{title}</div>
          <div className={styles.sideByside__body}  >
            {renderChilden.map(child => (
              <Col className={styles.sideByside__split} xs={12} >
                {React.Children.map(child, (ch) => (
                  <Col xs={width} >
                    {React.cloneElement(ch)}
                  </Col>
                ))} 
              </Col>
            ))}
          </div>
        </div>
      </div>
    </Col>
  );

}

FlexGrid.propTypes = {

};

const Stats = function (props) {
  const { 
    border,
    icon,
    count,
    details,
  } = props;
  return (
      <div className={`${styles.sideByside__leftCol} ${border ? styles.sideByside__first : '' }`}  >
        <div className={styles.sideByside__icon} >
          <i className={`fa fa-${icon}`} />
        </div>
        <div className={styles.sideByside__count}>
          <div>{count}</div>
          <div className={styles.sideByside__small}>{details}</div>
        </div>
      </div>
  );
}

Stats.propTypes = {
  
};

export { FlexGrid, Stats };
