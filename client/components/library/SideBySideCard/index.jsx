
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import { Col, Row } from '../Grid';

// TODO: call this component FlexGrid
// TODO: it's purpose is to appropriately size and place these next to eachother and add border styling
export default function SideBySideCard(props) {
  const {
    items
  } = props;

  // TODO: make this component dynamic to include more than 2 items
  // TODO: this component should work with children prop, not items
  // TODO: make the Icon and the Count separate components, call them "BigIcon" and "BigCount"

  return (
    <Col xs={12} md={6} className={styles.settingsFormsCol}>
      <Row className={styles.sideByside__body}>
        {items.map(i => (
          <Col xs={6} className={`${styles.sideByside__leftCol} ${i.first ? styles.sideByside__first : '' }`}  >
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
    </Col>
  );
}

SideBySideCard.propTypes = {
  // children: PropTypes.object.isRequired,
};
