
import React, { PropTypes } from 'react';
import { ListItem, Grid, Row, Col } from '../../library';
import LastSyncDisplay from '../../LastSyncDisplay';
import styles from './item.scss';

export default function ConnectorsListItem({ account }) {
  return (
    <ListItem className={styles.item}>
      <Grid className={styles.grid}>
        <Row className={styles.row}>
          <Col xs={4} className={styles.col}>
            <div>
              <div className={styles.name}>
                {account.name}
              </div>
              <div className={styles.id}>
                {account.id}
              </div>
            </div>
          </Col>
          <Col xs={4} className={styles.col}>
            <LastSyncDisplay
              className={styles.lastSync}
              date={account.lastSyncDate}
            />
          </Col>
        </Row>
      </Grid>
    </ListItem>
  );
}

ConnectorsListItem.propTypes = {
  accounts: PropTypes.object,
};
