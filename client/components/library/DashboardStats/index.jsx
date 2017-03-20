
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
    } = props;

    return (
        <Row className={styles.dashboardStats}>
            <Col className={styles.dashboardStats__item} xs={12} sm={6} md={3}>
                <IconCard className={styles.primaryColor} count="12" title="Appointment Booked" icon="calendar" size={10} />
            </Col>
            <Col className={styles.dashboardStats__item} xs={12} sm={6} md={3}>
                <IconCard className={styles.primaryBlue} count="64" title="Appointment Booked" icon="user" size={10} />
            </Col>
            <Col className={styles.dashboardStats__item} xs={12} sm={6} md={3}>
                <IconCard className={styles.primaryGreen} count="16" title="Appointment Booked" icon="bullhorn" size={10} />
            </Col>
            <Col className={styles.dashboardStats__item} xs={12} sm={6} md={3}>
                <IconCard className={styles.primaryYellow} count="23" title="Appointment Booked" icon="star" size={10} />
            </Col>
        </Row>
    );
}
