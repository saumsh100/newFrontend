
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import Card from '../Card';
import CardHeader from '../CardHeader';
import { Col, Row } from '../Grid';
export default function SideBySideCard(props) {
  const {
    title,
    items
  } = props;
  
  return (
    <Col xs={12} md={6} className={styles.settingsFormsCol}>
      <Card className={styles.sideByside} >
        <Row>
          <Col xs={12} className={styles.sideByside__title}>{title}</Col>
        </Row>
        <Row className={styles.sideByside__body}  >
          {items.map(i => (
          <Col xs={6} className={styles.sideByside__leftCol}  >
            <div className={styles.sideByside__icon} >
              <i className={`fa fa-${i.icon}`} />
            </div>
            <div className={styles.sideByside__count}>
              <div>{i.count}</div>
              <div className={styles.sideByside__small}>{i.details}</div>
            </div>
          </Col>
          ))}
        </Row>
      </Card>
    </Col>
  );
}

SideBySideCard.propTypes = {
  // children: PropTypes.object.isRequired,
};
