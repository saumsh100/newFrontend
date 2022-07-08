import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Card } from '../index';
import styles from '../styles';

export default function IconCard(props) {
  const { className, count, title, color, src, alt } = props;

  const classes = classNames(className, styles.iconCard, {
    [styles[`${color}Background`]]: color,
  });

  return (
    <Card className={classes} noBorder>
      <div className={styles.iconCard__wrapper}>
        <div className={styles.iconCard__count} data-test-id={`statCard_${title}`}>
          {count}
        </div>
        <div className={styles.iconCard__title}>{title}</div>
      </div>
      <img src={src} alt={alt || ''} />
    </Card>
  );
}

IconCard.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  alt: PropTypes.string,
};

IconCard.defaultProps = {
  className: '',
  count: 0,
  alt: '',
};
