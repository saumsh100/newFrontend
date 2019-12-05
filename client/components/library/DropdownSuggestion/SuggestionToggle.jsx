
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';
import Button from '../Button';
import styles from './styles.scss';

/**
 * The component that shows and
 * fires the dropdown actions.
 *
 */
class SuggestionToggle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayValue: props.selected ? props.selected.label : '',
    };

    this[`suggestion_toggle_${props.name}`] = createRef();
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.displaySuggestions = this.displaySuggestions.bind(this);
  }

  /**
   * If the component mount and it's a input
   * let's focus on it
   */
  componentDidMount() {
    this[`suggestion_toggle_${this.props.name}`].current.focus();
  }

  /**
   * Check if the value of the update is
   * different from the actual value, if so
   * let's update the state of the component.
   */
  static getDerivedStateFromProps(props, state) {
    const newDisplayValue = props.selected.label;
    if (newDisplayValue !== state.displayValue) {
      return {
        displayValue: newDisplayValue,
      };
    }
    return null;
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

    handleChange(search);
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
    const { toggleView, disabled, isOpen, name } = this.props;
    if (disabled) return;

    if (!isOpen) {
      this[`suggestion_toggle_${name}`].current.focus();
    }
    return toggleView();
  }

  render() {
    const { name, handleBlur, label, theme, error, disabled, isOpen } = this.props;

    const labelClassName = classNames(theme.label, {
      [theme.filled]: this.state.displayValue,
      [theme.activeLabel]: isOpen,
      [theme.errorLabel]: error,
    });

    const toggleClassName = classNames({
      [theme.toggleDiv]: !disabled,
      [theme.toggleDivDisabled]: disabled,
      [theme.active]: isOpen,
      [theme.errorToggleDiv]: error,
    });

    const caretIconClassName = classNames(theme.caretIcon, {
      [theme.activeIcon]: isOpen,
      [theme.errorIcon]: error,
    });

    return (
      <Button
        type="button"
        className={toggleClassName}
        onClick={this.displaySuggestions}
        data-test-id={this.props['data-test-id']}
      >
        <div className={theme.toggleValueDiv}>
          <div className={styles.selectLabel}>
            <div>{this.state.displayValue}</div>
            <select
              size={this.props.options.length}
              onChange={this.handleSearch}
              onBlur={handleBlur}
              onKeyDown={this.handleKeydown}
              className={styles.hiddenSelect}
              id={`suggestion_toggle_${name}`}
              tabIndex={-1}
              ref={this[`suggestion_toggle_${name}`]}
            >
              {this.props.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <span className={labelClassName}>{label}</span>
          <div className={theme.caretIconWrapper}>
            <Icon className={caretIconClassName} icon="caret-down" type="solid" />
          </div>
        </div>
        <div className={theme.error}>{error || ''}</div>
      </Button>
    );
  }
}
export default SuggestionToggle;

SuggestionToggle.propTypes = {
  'data-test-id': PropTypes.string.isRequired,
  selected: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  handleKeydown: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  toggleView: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  theme: PropTypes.objectOf(PropTypes.string),
};

SuggestionToggle.defaultProps = {
  theme: {},
  error: '',
  disabled: false,
};
