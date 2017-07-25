import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.scss';

class CircleGague extends PureComponent {
  render() {
    const emptyClassName = classnames(styles.empty, this.props.emptyClassName);
    const className = classnames(styles.full, this.props.className);
    const circumference = (this.props.radius - 15) * Math.PI;
    return (<svg height={this.props.radius} width={this.props.radius} className={styles.gauge}>
      <circle
        style={{ strokeDasharray: circumference }}
        className={emptyClassName}
        cx={this.props.radius / 2}
        cy={this.props.radius / 2}
        r={(this.props.radius - 15) / 2}
      />
      <circle
        style={{ strokeDasharray: circumference, strokeDashoffset: circumference - (circumference * (this.props.percentage / 100)) }}
        className={className}
        cx={this.props.radius / 2}
        cy={this.props.radius / 2}
        r={(this.props.radius - 15) / 2}
      />
    </svg>);
  }
}

CircleGague.propTypes = {
  radius: PropTypes.number,
  percentage: PropTypes.number.isRequired,
  className: PropTypes.string,
  emptyClassName: PropTypes.string,
};

CircleGague.defaultProps = {
  radius: 200,
  className: styles.full,
  emptyClassName: styles.empty,
};

export default CircleGague;
