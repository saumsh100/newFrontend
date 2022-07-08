import React from 'react';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import withTheme from '../../../hocs/withTheme';
import styles from './reskin-styles.scss';

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
    dashboardDayPicker,
    rounded,
    noBorder,
    widget,
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
    [theme.widgetInput]: widget,
    [theme.disabled]: disabled,
    [theme.erroredInput]: error,
    [theme.inputWithIcon]: iconComponent || icon,
    [theme.rounded]: rounded,
    [theme.noBorderInput]: noBorder,
  });

  const inputWrapperClassName = classNames(theme.group, {
    [classStyles]: classStyles,
    [theme.disabledGroup]: disabled,
  });

  const dayPickerClassName = classNames(theme.dayPicker);

  const errorClassName = theme.error;

  const errorComponent = error && <span className={errorClassName}>{error}</span>;

  const icComponent =
    iconComponent || (icon && <Icon className={iconClassName} type={iconType} icon={icon} />);
  return dashboardDayPicker ? (
    <div className={inputWrapperClassName}>
      <div className={dayPickerClassName}>
        <div>
          <input type={type} className={inputClassName} {...inputProps} ref={props.refCallBack} />
          <span className={theme.dayPickerBar} />
        </div>
        {iconComponent}
      </div>
    </div>
  ) : (
    <div className={inputWrapperClassName}>
      <input type={type} className={inputClassName} {...inputProps} ref={props.refCallBack} />
      {!widget && (
        <span
          className={classNames(theme.bar, {
            [theme.noBorderInput]: noBorder,
          })}
        />
      )}
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
  dashboardDayPicker: PropTypes.bool,
  classStyles: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.string), PropTypes.string]),
  iconComponent: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  rounded: PropTypes.bool,
  noBorder: PropTypes.bool,
  widget: PropTypes.bool,
};

Input.defaultProps = {
  disabled: false,
  dashboardDayPicker: false,
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
  rounded: false,
  noBorder: false,
  widget: false,
};

export default withTheme(Input, styles);
