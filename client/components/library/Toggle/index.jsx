
import  React, { PropTypes } from 'react';
import classNames from 'classnames';
import RCToggle from 'react-toggle';
import styles from './styles.scss';

export default function Toggle(props) {
  const {
    className,
    icons,
    color,
    theme,
    label,
  } = props;

  let classes = classNames(styles.toggle, 'CareCruToggle', `CareCruToggle-${color}`);
  if (theme) {
    classes = classNames(styles[`theme_${theme}Background`]);
  }

  return (
    <div className={classNames(className, styles.toggleWrapper)}>
      {label ?
        <label className={styles.toggleLabel}>
          {label}
        </label>
      : null}
      <RCToggle
        {...props}
        icons={icons}
        className={classes}
      />
    </div>
  );
}

Toggle.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  icons: PropTypes.bool,
  theme: PropTypes.string,
  label: PropTypes.string,
};

Toggle.defaultProps = {
  color: 'red',
  icons: false,
};
