
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Tag(props) {
  const { label, color } = props;

  const classname = classNames(styles.tagsContainer);
  const iconClass = classNames(styles.close, 'fa fa-close');
  return (
    <div style={{ borderLeft: `4px solid ${color}` }} className={classname}>
      {label}
      <i className={iconClass} />
    </div>
  );
}

Tag.defaultProps = {};

Tag.propTypes = {};
