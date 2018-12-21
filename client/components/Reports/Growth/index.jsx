
import React, { Component } from 'react';
import { Card, Tabs, Tab } from '../../library';
import CallTracking from './CallTracking';
import styles from '../tabStyles.scss';

class Growth extends Component {
  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }

  render() {
    return (
      <Card className={styles.card}>
        <Tabs index={this.state.index} onChange={i => this.setState({ index: i })} noUnderLine>
          <Tab label="Call Tracking" className={styles.tab} activeClass={styles.activeTab} />
        </Tabs>
        <div className={styles.container}>
          <CallTracking />
        </div>
      </Card>
    );
  }
}

Growth.propTypes = {};

export default Growth;
