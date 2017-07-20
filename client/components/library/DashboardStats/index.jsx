
import React, { PropTypes } from 'react';
import { Row, Col, IconCard  } from '../../library'
import styles from './styles.scss';

export default function DashboardStats(props) {
  const {
      className,
      count,
      title,
      icon,
      data,
  } = props;

  return (
    <Row className={styles.dashboardStats}>
      {data.map((d,i) => (
        <Col key={i} className={styles.dashboardStats__item} xs={12} sm={6} md={3}>
          <IconCard
            className={styles[d.color]}
            count={d.count} title={d.title}
            icon={d.icon}
            data-test-id={props['data-test-id']}
          />
        </Col>
      ))}
    </Row>
  );
}
