
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import textAreaStyles from './styles.scss';
import withTheme from '../../../hocs/withTheme';

function TextArea(props) {
  const {
    label,
    value,
    error,
    icon,
    type = 'text',
    min,
    borderColor,
    theme,
    classStyles,
  } = props;

  // TODO: add support for hint attribute
  // TODO: its like a label except it doesn't go ontop (think Chat input)

  const styles = theme;

  const inputProps = omit(props, ['error', 'borderColor', 'theme', 'classStyles']);

  const valuePresent = value !== null && value !== undefined && value !== '' &&
    !(typeof value === 'number' && isNaN(value));

  // Without this the label would fall back onBlur
  let labelClassName = styles.label;
  if (valuePresent) {
    labelClassName = classNames(styles.filled, labelClassName);
  }

  let inputClassName = styles.input;
  if (error) {
    labelClassName = classNames(styles.erroredLabel, labelClassName);
    inputClassName = classNames(styles.erroredInput, inputClassName);
  }

  if (borderColor) {
    inputClassName = classNames(styles[`${borderColor}Border`], inputClassName);
  }

  if (theme) {
    labelClassName = classNames(styles[`theme_${theme}Label`], labelClassName);
    inputClassName = classNames(styles[`theme_${theme}Input`], inputClassName);
  }

  const errorComponent = error ? <span className={styles.error}>{error}</span> : null;

  return (
    <div className={`${styles.group} ${classStyles}`}>
      <textarea className={inputClassName} {...inputProps} />
      <span className={styles.bar} />
      <label className={labelClassName}>
        {label}
      </label>
      {errorComponent}
    </div>
  );
}

TextArea.propTypes = {
  error: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),

  type: PropTypes.string,
  icon: PropTypes.string,
  theme: PropTypes.object,
};

export default withTheme(TextArea, textAreaStyles);
