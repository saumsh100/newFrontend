
import React, { PropTypes } from 'react';
import { Row, Col, Card, Icon  } from '../../../../library'
import Arrow from '../Arrow';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Patients(props) {
  const {
    fontColor,
    borderColor,
    data,
  } = props;

  return (
    <Row className={styles.patients}>
      {data.map((d, items, array) => {
        return (
          <Col className={styles.patients__wrapper} xs={12} sm={Math.floor(12 / array)}>
            <Card className={styles.patients__item} borderColor={borderColor} fontColor={fontColor}>
              <div className={styles.patients__item_count}>{d.count}</div>
              <div className={styles.patients__item_subtitle}>{d.title}</div>
              <div className={styles.patients__item_date}>{d.date}</div>
              <Icon className={styles.patients__item_icon} icon="question-circle" size={1.5} />
            </Card>
          </Col>
        )
      })}
    </Row>
  );
}
