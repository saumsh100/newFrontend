
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
  } = props;

  const classes = classNames(className, styles.iconCard);
  // TODO: Remove Col wrapper, this component does not care if it is in a Grid!
  // TODO: Make Icon a light grey to match title text, just like in mockups
  return (
    <div>
      <Card className={classes}>
        <div className={styles.iconCard__wrapper}>
          <div className={styles.iconCard__count}>{count}</div>
          <div className={styles.iconCard__title}>{title}</div>
        </div>
        <Icon
          className={styles.iconCard__icon}
          icon={icon}
          size={6}
        />
      </Card>
    </div>
  );
}

IconCard.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
};
