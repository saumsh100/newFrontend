
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import RDropdownMenu from 'react-dd-menu';
import classNames from 'classnames';
import withTheme from '../../../hocs/withTheme';
import SuggestionToggle from './SuggestionToggle';
import DataSlot from '../DataSlot';
import styles from './styles.scss';

class DropdownSuggestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      currentValue: props.value,
      scrollIndex: this.getIndex(props.value),
    };

    this.suggestionsNode = createRef();
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.renderList = this.renderList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderToggle = this.renderToggle.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.selectBeforeClose = this.selectBeforeClose.bind(this);
  }

  /**
   * Update currentValue and scrollIndex,
   * based on the data from the prevProps.
   *
   * @param {object} prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        currentValue: this.props.value,
        scrollIndex: this.getIndex(this.props.value),
      });
    }
    if (prevProps.value && this.state.isOpen) {
      this.scrollTo(this.state.scrollIndex);
    }
  }

  /**
   * This will get the index of the value, or the closest one.
   *
   * @param {string} val
   */
  getIndex(val) {
    const { validateValue } = this.props;
    if (!validateValue(val)) {
      return false;
    }

    return this.props.options.findIndex(opt => opt.value === val) || false;
  }

  /**
   * Opens the Dropdown
   */
  open() {
    this.setState({ isOpen: true });
  }

  /**
   * Closes the Dropdown
   */
  close() {
    this.setState({ isOpen: false });
  }

  /**
   * Toggle the dropdown
   */
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  /**
   * Scroll to the provided index.
   *
   * @param {string} index
   */
  scrollTo(index) {
    if (this.suggestionsNode) {
      if (!this.state.isOpen) {
        this.open();
      }
      this.suggestionsNode.current.scrollTop = index * 40;
    }
  }

  /**
   * Handle the data change,
   * if it's a valid value we will scroll to it
   *  and set it as the currentValue.
   *
   * @param {string} value
   */
  handleChange(value) {
    if (!this.state.isOpen) {
      this.open();
    }
    const index = this.getIndex(value);
    if (index > -1) {
      this.setState({
        scrollIndex: index,
        currentValue: value,
      });
      this.scrollTo(index);
      this.props.onChange(value);
    }
  }

  /**
   * Switch between the possible cases,
   * of a keyDown
   *
   * @param {object} e
   */
  handleKeydown(e) {
    const key = e.keyCode;
    switch (key) {
      case 9:
        this.selectBeforeClose();
        this.close();
        break;
      case 13:
        e.preventDefault();
        this.toggle();
        this.selectBeforeClose();
        break;
      case 40:
        this.navigateArrows('ArrowDown');
        break;
      case 38:
        this.navigateArrows('ArrowUp');
        break;
      default:
        break;
    }
  }

  /**
   * If the user has searched for a specific value,
   * but didn't selected let's select it before closing the dropdown.
   *
   */
  selectBeforeClose() {
    const { onChange } = this.props;
    const selected = this.props.options[this.state.scrollIndex];
    if (selected && selected.value !== this.state.currentValue) {
      this.setState({
        currentValue: selected.value,
      });
      onChange(selected.value);
    }
  }

  /**
   * With the given direction,
   * navigate up and down on the list
   *
   * @param {string} direction
   */
  navigateArrows(direction) {
    const { options, onChange } = this.props;
    const { isOpen } = this.state;
    if (direction === 'ArrowDown' && !isOpen) {
      this.setState({ isOpen: true });
    }
    let nextIndex = this.state.scrollIndex > -1 ? this.state.scrollIndex : -1;

    if (direction === 'ArrowDown') {
      nextIndex = this.state.scrollIndex >= options.length - 1 ? 0 : this.state.scrollIndex + 1;
    }

    if (direction === 'ArrowUp') {
      nextIndex = this.state.scrollIndex <= 0 ? options.length - 1 : this.state.scrollIndex - 1;
    }
    this.setState({
      scrollIndex: nextIndex,
    });
    onChange(options[nextIndex].value);
  }

  renderToggle() {
    return (
      <SuggestionToggle
        {...this.props}
        isOpen={this.state.isOpen}
        toggleView={this.toggle}
        handleBlur={this.selectBeforeClose}
        handleChange={this.handleChange}
        handleKeydown={this.handleKeydown}
        selected={{
          value: this.state.currentValue,
          label: this.props.renderValue(this.state.currentValue),
        }}
      />
    );
  }

  renderList() {
    return this.props.renderList(
      this.props,
      this.state.currentValue,
      this.state.scrollIndex,
      this.close,
      this.suggestionsNode,
    );
  }

  render() {
    const { theme } = this.props;
    const children = this.renderList();
    const toggle = this.renderToggle();
    const menuOptions = {
      children,
      toggle,
      align: this.props.align,
      isOpen: this.state.isOpen,
      close: this.close,
      animAlign: 'right',
      className: classNames(this.props.className, theme.wrapper),
      closeOnInsideClick: false,
      closeOnOutsideClick: true,
      enterTimeout: 70,
      leaveTimeout: 70,
    };
    return <RDropdownMenu {...menuOptions} />;
  }
}

/**
 * Default format props
 */
const formatValue = value => value;

/**
 * Default render prop
 */
const renderValue = value => value;

/**
 * Default validate props
 */
const validateValue = val => val?.length;

/**
 * The default renderList function.
 *
 * @param props
 * @param currentValue
 * @param scrollIndex
 * @param close
 * @param callback
 * @returns {*}
 */
export default withTheme(DropdownSuggestion, styles);

const renderList = (props, currentValue, scrollIndex, close, callback) => (
  <div tabIndex="-1" className={styles.dropDownList} ref={callback}>
    {props.options.map((option, i) => (
      <DataSlot
        key={option.value}
        {...props}
        selected={currentValue === option.value}
        option={option}
        onClick={(e) => {
          e.preventDefault();
          props.onChange(option.value);
          scrollIndex = i;
          close();
        }}
      />
    ))}
  </div>
);

renderList.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
};

renderList.defaultProps = {
  options: [],
};

DropdownSuggestion.propTypes = {
  align: PropTypes.string,
  className: PropTypes.string,
  'data-test-id': PropTypes.string,
  defaultValue: PropTypes.string,
  formatValue: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
  renderList: PropTypes.func,
  renderValue: PropTypes.func,
  strict: PropTypes.bool,
  theme: PropTypes.shape(PropTypes.object),
  validateValue: PropTypes.func,
  value: PropTypes.string,
};

DropdownSuggestion.defaultProps = {
  renderList,
  formatValue,
  renderValue,
  strict: true,
  validateValue,
  align: null,
  className: null,
  'data-test-id': null,
  defaultValue: null,
  options: [],
  theme: {},
  value: null,
};
