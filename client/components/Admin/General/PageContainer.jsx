
import React from 'react';
import PropTypes from 'prop-types';
import styles from './page-container.scss';

import { Card, CardHeader, Breadcrumbs, Row, Col } from '../../library';

const PageContainer = ({
  title, breadcrumbs, renderButtons, children,
}) => {
  const renderHeaderPanel = () => (
    <div className={styles.headerPanel}>
      {renderButtons ? (
        <Row middle="md">
          <Col md={8}>
            <Breadcrumbs items={breadcrumbs} />
          </Col>
          <Col md={4} style={{ textAlign: 'right' }}>
            {renderButtons()}
          </Col>
        </Row>
      ) : (
        <Breadcrumbs items={breadcrumbs} />
      )}
    </div>
  );

  return (
    <div className={styles.mainContainer}>
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader} title={title} />
        <div className={styles.cardContent}>
          {renderHeaderPanel()}
          {children}
        </div>
      </Card>
    </div>
  );
};

PageContainer.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderButtons: PropTypes.func,
  children: PropTypes.node,
};

export default PageContainer;
