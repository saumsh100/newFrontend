import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.scss';

export default function InfoSection({ title, className, children }) {
  const style = classnames(styles.infoSection, className);
  return (
    <div className={style}>
      <h3>{title}</h3>
      <span>{children}</span>
    </div>
  );
}

InfoSection.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
