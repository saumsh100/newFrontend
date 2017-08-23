
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import styles from './styles.scss';

const starRatingsMap = {
  1: 'Very Bad',
  2: 'Bad',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
};

export default class Stars extends Component {
  constructor(props) {
    super(props);

    this.onSelectStar = this.onSelectStar.bind(this);
  }

  onSelectStar(i) {
    this.props.onChange && this.props.onChange(i);
  }

  generateSelectHandler(i) {
    return () => this.onSelectStar(i);
  }

  render() {
    const { size, value, isStatic } = this.props;

    const CustomStar = (props) => {
      const { i } = props;
      const isFilled = value >= i;
      const isSelected = value === i;
      const icon = isFilled ? 'star' : 'star-o';
      let starClass = isFilled ? styles.filled : styles.empty;
      if (isSelected && !isStatic) {
        starClass = classNames(styles.selected, starClass);
      }

      if (!isStatic) {
        starClass = classNames(styles.starChildDynamic, starClass);
      }

      const wrapperClass = isStatic ? '' : styles.starWrapper;
      const labelClass = isSelected && !isStatic ? styles.labelSelected : styles.label;
      const iconProps = {
        className: starClass,
        size: size,
        icon: icon,
      };

      if (!isStatic) {
        iconProps.onClick = this.generateSelectHandler(i);
      }

      return (
        <div className={wrapperClass}>
          <Icon {...iconProps} />
          <div className={labelClass}>
            {starRatingsMap[i]}
          </div>
        </div>
      );
    };

    const text = value ? `${starRatingsMap[value]} Experience` : null;
    return (
      <div>
        <div className={styles.fractionWrapper}>
          <div className={styles.numerator}>
            {value || '?'}
          </div>
          <div className={styles.denominator}>
            /5
          </div>
        </div>
        <div className={styles.ratingsText}>
          {text}
        </div>
        <div className={styles.starsContainer}>
          <CustomStar i={1} />
          <CustomStar i={2} />
          <CustomStar i={3} />
          <CustomStar i={4} />
          <CustomStar i={5} />
        </div>
      </div>
    );
  }
}

Stars.defaultProps = {
  size: 4,
  isStatic: false,
};

Stars.propTypes = {
  size: PropTypes.number,
  isStatic: PropTypes.bool,
};
