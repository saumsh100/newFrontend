
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

export default function InfoDump(props) {
  const { label, data, className, component, type, children } = props;

  const classes = classNames(className, styles.container);

  const dataClass = classNames({
    [styles.data]: !component,
    [styles.noData]: !data && !component,
    [styles.email]: !component && type === 'email',
  });

  return (
    <div className={classes}>
      <div className={styles.label}>{label}</div>
      <div className={dataClass}>
        {data || component || 'n/a'}
        {children()}
      </div>
    </div>
  );
}

InfoDump.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  component: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.func,
};

InfoDump.defaultProps = {
  type: '',
  data: null,
  component: null,
  className: null,
  children: () => null,
};
