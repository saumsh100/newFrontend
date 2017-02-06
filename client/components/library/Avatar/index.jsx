
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Avatar(props) {
  const classes = classNames(props.className, styles.avatar);
  return (
    <div className={classes}>
      <img className={styles.img} src={props.url} alt={props.title} />
    </div>
  );
}

Avatar.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
};
