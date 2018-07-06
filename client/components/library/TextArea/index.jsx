
import React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import withTheme from '../../../hocs/withTheme';
import styles from './styles.scss';

function TextArea(props) {
  const {
    label, value, error, borderColor, theme, classStyles,
  } = props;

  const inputProps = omit(props, ['error', 'borderColor', 'theme', 'classStyles']);

  const labelClass = classNames(theme[`theme_${theme}Label`], theme.label, {
    [theme.filled]: value.length,
    [theme.erroredLabel]: error,
  });

  const inputClassName = classNames(theme.input, theme[`theme_${theme}Input`], {
    [theme[`${borderColor}Border`]]: borderColor,
    [theme.erroredInput]: error,
  });
  return (
    <div className={classNames(theme.group, classStyles)}>
      <textarea className={inputClassName} {...inputProps} />
      <span className={theme.bar} />
      <div className={theme.labelWrapper}>
        <span className={labelClass}>{label}</span>
      </div>
      {error && <span className={theme.error}>{error}</span>}
    </div>
  );
}

TextArea.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  borderColor: PropTypes.string,
  classStyles: PropTypes.string,
  theme: PropTypes.objectOf(PropTypes.string),
};

TextArea.defaultProps = {
  error: '',
  label: '',
  borderColor: '',
  classStyles: '',
  theme: {},
};

export default withTheme(TextArea, styles);
