import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, VButton } from '../../library';
import styles from './enterprise-page.scss';

const EnterprisePage = ({ children }) => (
  <div>
    <Row className={styles.header}>
      <Col md={8}>
        { null /* TODO: sub navigation */ }
      </Col>

      <Col md={4} className={styles['header-title']}>
        Enterprise
      </Col>
    </Row>

    <div className={styles['page-container']}>

      <Row middle="md" className={styles['filter-container']}>
        <Col md={6}>
          <h1 className={styles['page-title']}>Patients</h1>
          <VButton title="Add Segment" compact className={styles['btn-add-segment']} color="darkgrey" />
        </Col>
        <Col md={6} className={styles['filter-buttons']} >
          { /* TODO: Implement ButtonDropDown element */ }
          <VButton title="Save" color="red" compact />
          <VButton title="Clear" compact />
        </Col>
      </Row>

      <div>
        { children }
      </div>
    </div>
  </div>
);

EnterprisePage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EnterprisePage;
