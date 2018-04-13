
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

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
      search: '',
      option: {},
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
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
    this[`suggestion_toggle_${this.props.name}`].focus();
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
  handleSearch(e) {
    const { handleChange } = this.props;
    const search = e.target.value;

    this.setState({ search }, () => {
      handleChange(search);
    });
  }

  handleKeydown(e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
    this.props.handleKeydown(e);
  }

  /**
   * This toggles the view
   * and select the input field.
   */
  displaySuggestions() {
    this.setState({ search: '' });
    const { toggleView, disabled, isOpen, asInput } = this.props;

    if (disabled || asInput) return;
    if (!isOpen) {
      toggleView();
    }
  }

  render() {
    const { name, handleBlur, label, theme, error, disabled, isOpen, asInput } = this.props;

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

    return (
      <div
        className={disabled ? theme.toggleDivDisabled : toggleClassName}
        onClick={this.displaySuggestions}
        data-test-id={this.props['data-test-id']}
      >
        <div className={theme.toggleValueDiv}>
          <label
            htmlFor={`suggestion_toggle_${name}`}
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <div>{this.state.displayValue}</div>
            <select
              size={this.props.options.length}
              onChange={this.handleSearch}
              onBlur={handleBlur}
              onKeyDown={this.handleKeydown}
              style={{ position: 'absolute', top: '-30px', zIndex: '-1' }}
              id={`suggestion_toggle_${name}`}
              ref={input => {
                this[`suggestion_toggle_${name}`] = input;
              }}
            >
              {this.props.options.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor={`suggestion_toggle_${name}`} className={labelClassName}>
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
