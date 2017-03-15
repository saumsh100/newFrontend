
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import { Col, Row } from '../Grid';
import Guage from '../Guage'

const FlexGrid = function (props) {
  const {
    items,
    title,
  } = props;
  const itemWidth = `${100 / items.length}%`;
  const itemStyle = { width: itemWidth };
  const gridStyle = { width: '100%' }; 
  return (
    <div style={gridStyle} className={styles.settingsFormsCol}>
      <div className={styles.sideByside} >
        <div className={styles.sideByside__title}>{title}</div>
        <div className={styles.sideByside__body}  >
          {items.map(i => (
          <div style={itemStyle} className={`${styles.sideByside__leftCol} ${i.first ? styles.sideByside__first : '' }`}  >
            <div className={styles.sideByside__icon} >
              <i className={`fa fa-${i.icon}`} />
            </div>
            <div className={styles.sideByside__count}>
              <div>{i.count}</div>
              <div className={styles.sideByside__small}>{i.details}</div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );

}

FlexGrid.propTypes = {
  // children: PropTypes.object.isRequired,
};


export default FlexGrid;
