
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, CardHeader } from '../../../../library';
import styles from './styles.scss';

class Information extends Component {
  render() {
    const { borderColor, data } = this.props;

    return (
      <Card className={styles.total}>
        <CardHeader className={styles.total__header} title="Listing Information" />
        <div className={styles.total__wrapper}>
          <div className={styles.total__body}>
            {data.map((obj, i) => (
              <div key={i} className={styles.total__body_list}>
                <div className={styles.total__body_item}>
                  <div className={styles.total__item}>
                    <div className={styles.total__item_wrapper}>
                      <span className={styles.total__body_text}>{obj.title}</span>
                    </div>
                    <div className={styles.total__item_wrapper}>
                      <span className={styles.total__body_data}>{obj.data}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }
}

Information.propTypes = { data: PropTypes.arrayOf(PropTypes.object) };

export default Information;
