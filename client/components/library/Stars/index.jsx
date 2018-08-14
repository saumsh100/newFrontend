
import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
    const {
      size, value, isStatic, isMinimal,
    } = this.props;

    const CustomStar = (props) => {
      const { i } = props;
      const isFilled = value >= i;
      const isSelected = value === i;
      const type = isFilled ? 'solid' : 'regular';
      let starClass = isFilled ? styles.filled : styles.empty;
      if (isSelected && !isStatic) {
        starClass = classNames(styles.selected, starClass);
      }

      if (!isStatic) {
        starClass = classNames(styles.starChildDynamic, starClass);
      }

      const wrapperClass = isStatic ? '' : styles.starWrapper;
      const labelClass =
        isSelected && !isStatic ? styles.labelSelected : styles.label;
      const iconProps = {
        className: starClass,
        size,
        icon: 'star',
        type,
      };

      if (!isStatic) {
        iconProps.onClick = this.generateSelectHandler(i);
      }

      return (
        <div className={wrapperClass}>
          <Icon {...iconProps} />
          <div className={labelClass}>{starRatingsMap[i]}</div>
        </div>
      );
    };

    const text = value ? `${starRatingsMap[value]} Experience` : null;
    return (
      <div>
        {!isMinimal ? (
          <div className={styles.fractionWrapper}>
            <div className={styles.numerator}>{value || '?'}</div>
            <div className={styles.denominator}>/5</div>
          </div>
        ) : null}
        {!isMinimal ? <div className={styles.ratingsText}>{text}</div> : null}
        <div className={styles.starsContainer}>
          <CustomStar i={1} />
          <CustomStar i={2} />
          <CustomStar i={3} />
          <CustomStar i={4} />
          <CustomStar i={5} />
        </div>
        {isMinimal ? (
          <div className={styles.minimalRatingsText}>{text}</div>
        ) : null}
      </div>
    );
  }
}

Stars.defaultProps = {
  size: 3.6,
  isStatic: false,
  isMinimal: false,
};

Stars.propTypes = {
  size: PropTypes.number.isRequired,
  isStatic: PropTypes.bool.isRequired,
  isMinimal: PropTypes.bool.isRequired,
};
