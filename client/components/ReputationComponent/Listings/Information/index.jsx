import React, { Component } from 'react';
import { Card, CardHeader } from '../../../library';
import styles from './styles.scss';

class Information extends Component {
  render() {
    const {
      borderColor,
    } = this.props;
    const data = [
      { title: 'Business Name', data: 'ABC Dental Care' },
      { title: 'Street Address', data: 'East 2nd Ave' },
      { title: 'City', data: 'Vancouver' },
      { title: 'State / Prov / Region ', data: 'BC' },
      { title: 'Zip / Postal Code', data: 'V1B2C3' },
      { title: 'Phone', data: '123 456 7890' },
      { title: 'Website', data: 'https://www.abcdentalcare.com' },
    ];
    return (
      <Card
        borderColor={borderColor}
        className={styles.total}
      >
        <CardHeader
          className={styles.total__header}
          title="Listing Information"
        />
        <div className={styles.total__wrapper}>
          <div className={styles.total__body}>
            {data.map((obj, i) => (
              <div
                key={i}
                className={styles.total__body_list}
              >
                <div className={styles.total__body_item}>
                  <div className={styles.total__item}>
                    <div className={styles.total__item_wrapper}>
                      <b className={styles.total__body_text}>{obj.title}</b>
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

export default Information;
