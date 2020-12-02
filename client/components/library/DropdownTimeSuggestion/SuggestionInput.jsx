
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import { Input } from '..';
import styles from './styles.scss';

class SuggestionInput extends Component {
  constructor(props) {
    super(props);

    this[`suggestion_time_toggle_${props.name}`] = createRef();
    this.displaySuggestions = this.displaySuggestions.bind(this);
  }

  /**
   * This toggles the view
   * and select the input field.
   */
  displaySuggestions() {
    const { name, toggleView, disabled, isOpen } = this.props;

    if (disabled) return;
    if (!isOpen) {
      toggleView();
    }
    if (this[`suggestion_time_toggle_${name}`]) {
      this[`suggestion_time_toggle_${name}`].current.focus();
      this[`suggestion_time_toggle_${name}`].current.select();
    }
  }

  render() {
    const {
      name,
      label,
      handleKeydown,
      handleBlur,
      theme,
      error,
      disabled,
      isOpen,
      placeholder,
      value,
      handleChange,
    } = this.props;

    const labelClassName = classNames(theme.label, {
      [theme.filled]: value,
      [theme.activeLabel]: isOpen,
      [theme.errorLabel]: error,
    });

    const toggleClassName = classNames(theme.toggleDiv, {
      [theme.active]: isOpen,
      [theme.errorToggleDiv]: error,
    });

    const caretIconClassName = classNames(theme.caretIcon, {
      [theme.activeIcon]: isOpen,
      [theme.errorIcon]: error,
    });
    /* eslint-disable jsx-a11y/label-has-for */
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={this.displaySuggestions}
        onKeyDown={e => e.keyCode === 13 && this.displaySuggestions()}
        className={disabled ? theme.toggleDivDisabled : toggleClassName}
      >
        <div className={theme.toggleValueDiv}>
          <Input
            type="text"
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onClick={this.displaySuggestions}
            onFocus={this.displaySuggestions}
            onChange={e => handleChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeydown}
            className={classNames(styles.inputToggler, theme.inputToggler, {
              [styles.disabled]: disabled,
              [theme.erroredInput]: error,
            })}
            theme={{ group: styles.groupFull }}
            id={`suggestion_time_toggle_${name}`}
            refCallBack={this[`suggestion_time_toggle_${name}`]}
          />
          <label htmlFor={`suggestion_time_toggle_${name}`} className={labelClassName}>
            {label}
          </label>
          <div className={theme.caretIconWrapper}>
            <Icon className={caretIconClassName} icon="caret-down" type="solid" />
          </div>
        </div>
        <div className={theme.error}>{error || ''}</div>
      </div>
    );
  }
}

export default SuggestionInput;

SuggestionInput.propTypes = {
  handleKeydown: PropTypes.func.isRequired,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func.isRequired,
  toggleView: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  theme: PropTypes.objectOf(PropTypes.string).isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
};

SuggestionInput.defaultProps = {
  error: '',
  value: '',
  placeholder: null,
  handleBlur: () => {},
};
