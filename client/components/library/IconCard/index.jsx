
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Col, Card, CardHeader, Icon  } from '../index'
import styles from './styles.scss';

export default function IconCard(props) {
  const {
    className,
    count,
    title,
    icon,
    size,
  } = props;

  const classes = classNames(className, styles.iconCard);
  return (
    <Col {...props}>
      <Card className={classes}>
        <div className={styles.iconCard__wrapper}>
          <div className={styles.iconCard__count}>{count}</div>
          <div className={styles.iconCard__title}>{title}</div>
        </div>
        <Icon className={styles.iconCard__icon}
              icon={icon}
              size={size} />
      </Card>
    </Col>
  );
}

IconCard.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
};
