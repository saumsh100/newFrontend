
import React, { PropTypes } from 'react';
import { Row, Col,   } from '../../../../library'
import Arrow from '../Arrow';
import classNames from 'classnames';
import styles from './styles.scss';

export default function BusinessStats(props) {
  const {
      data,
  } = props;

  return (
    <Row className={styles.businessStats}>
      {data.map((d,i) => (
        <Col key={i} className={styles.businessStats__item} xs={12} md={4}>
            <Arrow  className={classNames(d.className, styles[d.color])}
                   percentage={d.percentage}
                   count={d.count}
                   title={d.title}
                   icon={d.icon}
                   size={d.size} />
        </Col>
      ))}
    </Row>
    );
}
