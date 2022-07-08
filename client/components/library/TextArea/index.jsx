import React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import withTheme from '../../../hocs/withTheme';
import styles from './reskin-styles.scss';

function TextArea(props) {
  const { label, value, error, borderColor, theme, classStyles } = props;

  const inputProps = omit(props, ['error', 'borderColor', 'theme', 'classStyles']);

  const labelClass = classNames(theme.label, {
    [theme.filled]: value && value.length,
    [theme.erroredLabel]: error,
  });

  const inputClassName = classNames(theme.input, {
    [theme[`${borderColor}Border`]]: borderColor,
    [theme.erroredInput]: error,
  });
  return (
    <div className={classNames(theme.group, classStyles)}>
      <div className={theme.labelWrapper}>
        <span className={labelClass}>{label}</span>
      </div>
      <textarea className={inputClassName} {...inputProps} />
      <span className={theme.bar} />

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
