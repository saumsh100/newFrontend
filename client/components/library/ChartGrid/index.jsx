
import React, { PropTypes } from 'react';
import Guage from '../Guage'
import styles from '../FlexGrid/styles.scss';

const ChartGrid = function (props) {
  const { positive, negative, icon, text, stars, title } = props;

  const itemStyle = { width: '50%' };
  const gridStyle = { width: '100%' }; 
  return (
    <div style={gridStyle} className={styles.settingsFormsCol}>
      <div className={styles.sideByside} >
        <div className={styles.sideByside__title}>{title}</div>
        <div className={styles.sideByside__body}  >

          <div style={itemStyle} className={styles.sideByside__leftCol}>
            <div className={styles.sideByside__icon} >
              <i className={`fa fa-${icon}`} />
            </div>
            <div className={styles.sideByside__count}>
              <div>{stars}</div>
              <div className={styles.sideByside__small}>{text}</div>
            </div>
          </div>
          <div style={itemStyle} className={styles.sideByside__leftCol}>
            <div>
                <div className={styles.sideByside__vote_icons}>
                  <div className={styles.sideByside__vote_icons_block} >
                    <i className="fa fa-thumbs-up">
                      <span className={styles.sideByside__vote_icons_text} >
                        {positive}
                      </span>
                    </i>
                  </div>
                  <div className={styles.sideByside__vote_icons_block}>
                    <i className="fa fa-thumbs-down">
                      <span className={styles.sideByside__vote_icons_text}>
                        {negative}
                      </span>
                    </i>
                  </div>
                </div>
            </div>
            <div>
              <Guage percentage={80} width={100} height={50} />
            </div>
          </div>
        </div>
      </div> 
    </div>
  )
}

export default ChartGrid;
