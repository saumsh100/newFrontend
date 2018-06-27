
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import { Input } from '..';
import styles from './styles.scss';

class SuggestionInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayValue: props.selected.label,
      option: props.selected,
    };
    this.handleChange = this.handleChange.bind(this);
    this.displaySuggestions = this.displaySuggestions.bind(this);
  }

  /**
   * Check if we receive a new selected object,
   * if so let's update the state of the component.
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected) {
      this.setState({
        displayValue: nextProps.selected.label,
        option: nextProps.selected,
      });
    }
  }

  /**
   * Before firing the prop,
   * let's assign the displayValue.
   *
   * @param e
   */
  handleChange(e) {
    const { handleChange } = this.props;

    const displayValue = e.target.value;

    this.setState({ displayValue }, () => {
      handleChange(displayValue);
    });
  }

  /**
   * This toggles the view
   * and select the input field.
   */
  displaySuggestions() {
    const {
      name, toggleView, disabled, isOpen,
    } = this.props;

    if (disabled) return;
    if (!isOpen) {
      toggleView();
    }
    if (this[`suggestion_time_toggle_${name}`]) {
      this[`suggestion_time_toggle_${name}`].focus();
      this[`suggestion_time_toggle_${name}`].select();
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
    } = this.props;

    const labelClassName = classNames(theme.label, {
      [theme.filled]: this.state.displayValue,
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

    return (
      <div
        className={disabled ? theme.toggleDivDisabled : toggleClassName}
        onClick={this.displaySuggestions}
        data-test-id={this.props['data-test-id']}
      >
        <div className={theme.toggleValueDiv}>
          <Input
            type="text"
            placeholder={this.props.placeholder}
            value={this.state.displayValue}
            onClick={this.displaySuggestions}
            onFocus={this.displaySuggestions}
            onChange={this.handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeydown}
            className={styles.inputToggler}
            theme={{ group: styles.groupFull }}
            id={`suggestion_time_toggle_${name}`}
            refCallBack={(input) => {
              this[`suggestion_time_toggle_${name}`] = input;
            }}
          />
          <label
            htmlFor={`suggestion_time_toggle_${name}`}
            className={labelClassName}
          >
            {label}
          </label>
          <div className={theme.caretIconWrapper}>
            <Icon
              className={caretIconClassName}
              icon="caret-down"
              type="solid"
            />
          </div>
        </div>
        <div className={theme.error}>{error || ''}</div>
      </div>
    );
  }
}

export default SuggestionInput;

SuggestionInput.propTypes = {
  'data-test-id': PropTypes.string,
  selected: PropTypes.object,
  toggleAsInput: PropTypes.func,
  handleKeydown: PropTypes.func,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  toggleView: PropTypes.func,
  disabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  theme: PropTypes.object,
};
