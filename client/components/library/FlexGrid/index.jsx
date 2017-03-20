
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import { Col, Card } from '../';
import Guage from '../Guage'
import chunk from 'lodash/chunk';

const FlexGrid = function (props) {
  const {
    items,
    title,
    children,
    borderColor,
  } = props;
  let n = 2;
  if (children.length === 3) n = 3;
  const width = Math.floor( 12 / n);
  const gridStyle = { width: '100%' };
  const renderChilden = chunk(children, n); 
  return (
    <Col xs={12} md={6}>
      <div className={styles.settingsFormsCol}>
        <Card className={styles.sideByside} borderColor={borderColor} >
          {title && <div className={styles.sideByside__title}>{title}</div>}
          <div className={styles.sideByside__body}  >
            {renderChilden.map(child => (
              <Col className={styles.sideByside__split} xs={12} >
                {React.Children.map(child, (ch) => (
                  <Col className={styles.sideByside__item} xs={width} >
                    {React.cloneElement(ch)}
                  </Col>
                ))} 
              </Col>
            ))}
          </div>
        </Card>
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
      <div className={styles.sideByside__leftCol}  >
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
