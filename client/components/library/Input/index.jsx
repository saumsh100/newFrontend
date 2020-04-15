
import React from 'react';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import withTheme from '../../../hocs/withTheme';
import styles from './styles.scss';

function Input(props) {
  const {
    label,
    value,
    error,
    icon,
    iconComponent,
    type = 'text',
    theme,
    classStyles,
    iconType,
    disabled,
  } = props;

  const inputProps = omit(props, [
    'error',
    'borderColor',
    'theme',
    'classStyles',
    'iconComponent',
    'iconType',
    'refCallBack',
    'tipSize',
  ]);

  const isFilled = (value || value === 0) && !(typeof value === 'number' && Number.isNaN(value));

  const labelClassName = classNames(theme.label, {
    [theme.erroredLabel]: error,
    [theme.filled]: isFilled,
    [theme.erroredLabelFilled]: isFilled && error,
  });

  const iconClassName = classNames(theme.icon, {
    [theme.erroredIcon]: error,
    [theme.hidden]: isFilled,
  });

  const inputClassName = classNames(theme.input, {
    [theme.disabled]: disabled,
    [theme.erroredInput]: error,
    [theme.inputWithIcon]: iconComponent || icon,
  });

  const inputWrapperClassName = classNames(theme.group, {
    [classStyles]: classStyles,
    [theme.disabledGroup]: disabled,
  });

  const errorClassName = theme.error;

  const errorComponent = error && <span className={errorClassName}>{error}</span>;

  const icComponent =
    iconComponent || (icon && <Icon className={iconClassName} type={iconType} icon={icon} />);

  return (
    <div className={inputWrapperClassName}>
      <input type={type} className={inputClassName} {...inputProps} ref={props.refCallBack} />
      <span className={theme.bar} />
      <span className={labelClassName}>{label}</span>
      {errorComponent}
      {icComponent}
    </div>
  );
}

Input.propTypes = {
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  refCallBack: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  type: PropTypes.string,
  icon: PropTypes.string,
  iconType: PropTypes.string,
  disabled: PropTypes.bool,
  classStyles: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.string), PropTypes.string]),
  iconComponent: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
};

Input.defaultProps = {
  disabled: false,
  error: '',
  label: '',
  value: '',
  theme: null,
  type: 'text',
  icon: '',
  iconType: 'solid',
  classStyles: '',
  iconComponent: null,
  refCallBack: null,
};

export default withTheme(Input, styles);
