import React, {PropTypes} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';


export default function Header(props) {
  const {
    className,
    children,
    title,
  } = props;

  const classes = classNames(className, styles.plainHeader);

  let titleComponent = null;
  if (title) {
    titleComponent = (
      <div className={styles.headerTitle}>
        {title}
      </div>
    );
  }

  return (
    <div {...props} className={classes}>
      <div className={styles.displayFlex}>
        {titleComponent}
      </div>
      <div className={styles.displayFlex}>
        {children}
      </div>
    </div>
  );
}