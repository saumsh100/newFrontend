
import React, { PropTypes } from 'react';
import Guage from '../Guage'
import styles from '../FlexGrid/styles.scss';

const ChartStats = function (props) {
  const { positive, negative, percentage } = props;

  return (
    <div className={styles.sideByside__leftCol}>
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

  )
}

export default ChartStats;
