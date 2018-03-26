
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import styles from './styles.scss';
import { Input } from '..';

/**
 * The component that shows and
 * fires the dropdown actions.
 *
 */
class SuggestionToggle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayValue: '',
      option: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.displaySuggestions = this.displaySuggestions.bind(this);
  }

  /**
   * Check if there a value on mounting,
   *  if so let's set the state of the component.
   */
  componentWillMount() {
    if (this.props.selected) {
      this.setState({
        displayValue: this.props.selected.label,
        option: this.props.selected,
      });
    }
  }

  /**
   * If the component mount and it's a input
   * let's focus on it
   */
  componentDidMount() {
    if (this.props.asInput) {
      this[`suggestion_toggle_${this.props.name}`].focus();
    }
  }
  /**
   * Check if the value of the update is
   * different from the actual value, if so
   * let's update the state of the component.
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
    const { name, toggleView, disabled, isOpen, asInput } = this.props;

    if (disabled || asInput) return;
    if (!isOpen) { toggleView(); }

    this[`suggestion_toggle_${name}`].focus();
    this[`suggestion_toggle_${name}`].select();
  }

  render() {
    const { name, handleKeydown, handleBlur, label, theme, error, disabled, isOpen, asInput } = this.props;

    const labelClassName = classNames(theme.label, {
      [theme.filled]: this.state.displayValue,
      [theme.activeLabel]: isOpen,
      [theme.errorLabel]: error,
    });

    const toggleClassName = classNames(theme.toggleDiv, {
      [theme.active]: isOpen,
      [theme.errorToggleDiv]: error,
      [theme.asInput]: asInput,
    });

    const caretIconClassName = classNames(theme.caretIcon, {
      [theme.activeIcon]: isOpen,
      [theme.errorIcon]: error,
    });

    const timesIconClassName = classNames(theme.times, {
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
            id={`suggestion_toggle_${name}`}
            refCallBack={(input) => { this[`suggestion_toggle_${name}`] = input; }}
          />
          <label htmlFor={`suggestion_toggle_${name}`} className={labelClassName}>
            {label}
          </label>
          {this.props.asInput ?
            <button onClick={this.props.toggleAsInput} className={theme.timesIconWrapper}>
              <Icon className={timesIconClassName} icon="times" type="light" />
            </button>
            :
            <div className={theme.caretIconWrapper}>
              <Icon className={caretIconClassName} icon="caret-down" type="solid" />
            </div>}
        </div>
        <div className={theme.error}>{error || ''}</div>
      </div>
    );
  }
}
export default SuggestionToggle;

SuggestionToggle.propTypes = {
  'data-test-id': PropTypes.string,
  selected: PropTypes.object,
  toggleAsInput: PropTypes.func,
  asInput: PropTypes.bool,
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
