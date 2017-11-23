
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../../library';
import styles from './styles.scss';

export default function IconCircle(props) {
  const { selected, icon, color } = props;

  const wrapperClass = selected ?
    styles[`selectWrapperCircleSelected_${color}`] :
    styles.selectWrapperCircle;

  return (
    <div className={wrapperClass}>
      <div className={styles.wrapperCircle}>
        <div className={styles[`iconCircle_${color}`]}>
          {icon ? <Icon icon={icon} /> : null}
        </div>
      </div>
    </div>
  );
}

IconCircle.propTypes = {
  icon: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  color: PropTypes.string.isRequired,
};

IconCircle.defaultProps = {
  color: 'green',
};
