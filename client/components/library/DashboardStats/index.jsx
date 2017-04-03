
import React, { PropTypes } from 'react';
import { Row, Col, IconCard  } from '../../library'
import styles from './styles.scss';

export default function DashboardStats(props) {
  const {
      className,
      count,
      title,
      icon,
      size,
      data,
  } = props;

  return (
    <Row className={styles.dashboardStats}>
      {data.map(d => (
        <Col className={styles.dashboardStats__item} xs={12} sm={6} md={3}>
          <IconCard
            className={styles[d.color]}
            count={d.count} title={d.title}
            icon={d.icon}
            size={d.size}
          />
        </Col>
      ))}
    </Row>
  );
}
