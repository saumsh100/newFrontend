
import React, { Component } from 'react';
import { Col, Row, Icon } from '../../../../library';
import classNames from 'classnames';
import styles from './styles.scss';

class Arrow extends Component {
  render() {
    const {
      className,
      percentage,
      question,
      count,
      title,
      icon,
      difference,
    } = this.props;
    return (
      <div className={classNames(styles.arrow, className)}>
        <Row>
          <Col className={styles.arrow__header} xs={12}>
            <div className={styles.arrow__header_wrapper}>
              {percentage && (
                <div className={styles.arrow__header_percentage}>
                  <span>{percentage}%</span>
                </div>
              )}
              <div className={styles.arrow__header_icon}>
                <Icon icon="question-circle" size={1.5} />
              </div>
            </div>
          </Col>
          <Col className={styles.arrow__body} xs={12}>
            <div className={styles.arrow__body_title}>
              <b>{count}</b>
            </div>
            <div className={styles.arrow__body_subtitle}>{title}</div>
            <div className={styles.arrow__body_icon}>
              <Icon icon={icon} size={3.75} />
            </div>
          </Col>
          <div className={styles.lower}>{difference}</div>
        </Row>
      </div>
    );
  }
}

export default Arrow;
