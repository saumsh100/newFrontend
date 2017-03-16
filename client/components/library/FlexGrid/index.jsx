
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import { Col, Row } from '../Grid';
import Guage from '../Guage'

const FlexGrid = function (props) {
  const {
    items,
    title,
    children,
  } = props;
  const width = Math.floor( 12/ children.length);
  const gridStyle = { width: '100%' };
  console.log("item length")
  console.log(children.length)
  console.log("children")
  console.log(children)
  return (
    <div style={gridStyle} className={styles.settingsFormsCol}>
      <div className={styles.sideByside} >
        <div className={styles.sideByside__title}>{title}</div>
        <div className={styles.sideByside__body}  >
        {React.Children.map(children, child => (
          <Col xs={width}>
            {React.cloneElement(child)}
          </Col>
        ))}
        </div>
      </div>
    </div>
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
