
import React, { Component } from 'react';
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
      displayValue: '',
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
    const {
      toggleView, disabled, asInput, isOpen, name,
    } = this.props;
    if (disabled || asInput) return;

    if (!isOpen) {
      this[`suggestion_toggle_${name}`].focus();
    }
    return toggleView();
  }

  render() {
    const {
      name, handleBlur, label, theme, error, disabled, isOpen, asInput,
    } = this.props;

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
      [theme.asInput]: asInput,
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
              ref={(input) => {
                this[`suggestion_toggle_${name}`] = input;
              }}
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
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }))
    .isRequired,
  asInput: PropTypes.bool.isRequired,
  handleKeydown: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  toggleView: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  theme: PropTypes.objectOf(PropTypes.string),
};

SuggestionToggle.defaultProps = {
  theme: {},
  error: '',
};
