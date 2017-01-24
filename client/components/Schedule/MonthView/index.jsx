import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import {fetchEntities} from '../../../thunks/fetchEntities';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styles from '../styles.scss';

class MonthView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <div className={styles.schedule}>
              <div className={`${styles.schedule__title} ${styles.title}`}>
                  <div className={styles.title__side}>
                      <div className={styles.title__month}>Wednesday</div>
                      <div className={styles.title__day}>FEBRUARY</div>
                  </div>
                  <div className={styles.title__number}>15</div>
              </div>
                Monthly schedule
            </div>
        );
    }
}

export default MonthView;
