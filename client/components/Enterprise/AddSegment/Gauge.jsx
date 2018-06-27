
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CircleGauge } from '../../library';
import styles from './styles.scss';

class Gauge extends PureComponent {
  render() {
    return (
      <div className={styles.gaugeContainer} style={{ height: '130px' }}>
        <div className={styles.gauge}>
          <CircleGauge percentage={this.props.percentage} radius={130} />
        </div>
        <div className={styles.info}>
          <h2>{this.props.percentage}%</h2>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Gauge.propTypes = {
  percentage: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};
export default Gauge;
