
import React, { Component } from 'react';
import { Card, Tabs, Tab } from '../../library';
import OnlineBooking from './OnlineBooking';
import Recalls from './Recalls';
import Reminders from './Reminders';
import Reviews from './Reviews';
import TotalProduction from './TotalProduction';

import styles from '../tabStyles.scss';

const components = {
  0: <OnlineBooking />,
  1: <Reminders />,
  2: <Recalls />,
  3: <Reviews />,
  4: <TotalProduction />,
};

class Pulse extends Component {
  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }

  renderComponent(index) {
    return components[index];
  }

  render() {
    return (
      <Card className={styles.card}>
        <Tabs index={this.state.index} onChange={i => this.setState({ index: i })} noUnderLine>
          <Tab label="Online Booking" className={styles.tab} activeClass={styles.activeTab} />
          <Tab label="Donna's Reminders" className={styles.tab} activeClass={styles.activeTab} />
          <Tab label="Donna's Recalls" className={styles.tab} activeClass={styles.activeTab} />
          <Tab label="Donna's Reviews" className={styles.tab} activeClass={styles.activeTab} />
          <Tab label="Total Production" className={styles.tab} activeClass={styles.activeTab} />
        </Tabs>
        <div className={styles.container}>{this.renderComponent(this.state.index)}</div>
      </Card>
    );
  }
}

Pulse.propTypes = {};

export default Pulse;
