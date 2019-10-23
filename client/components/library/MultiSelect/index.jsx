
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';

class MultiSelect extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedItems: [] };

    this.stateReducer = this.stateReducer.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.addSelectedItem = this.addSelectedItem.bind(this);
    this.getStateAndHelpers = this.getStateAndHelpers.bind(this);
  }

  componentDidMount() {
    this.setState({ selectedItems: this.props.initialSelectedItem });
  }

  /**
   * Extend renderProps
   *
   * @param downshift
   * @return {Object}
   */
  getStateAndHelpers(downshift) {
    return {
      handleSelection: this.handleSelection,
      toggleAll: this.toggleAll,
      selectedItems: this.state.selectedItems,
      ...downshift,
    };
  }

  toggleAll(options) {
    const callback = () => {
      this.props.onChange(this.state.selectedItems);
    };
    this.setState(
      prevState => ({
        selectedItems: options.length === prevState.selectedItems.length ? [] : options,
      }),
      callback,
    );
  }

  /**
   * Handles the action after receiveing a selection,
   * either adding or removing the value from the sekectedItems list.
   * Also fire a callback, so we can manage the state on the implementation.
   *
   * @param value
   * @param downshift
   */
  handleSelection({ value }) {
    const callback = () => {
      this.props.onChange(this.state.selectedItems);
    };

    if (this.state.selectedItems.includes(value)) {
      this.removeItem(value, callback);
    } else {
      this.addSelectedItem(value, callback);
    }
  }

  /**
   * Remove an item to the selectedItems state
   *
   * @param item
   * @param callback
   */
  removeItem(item, callback) {
    this.setState(
      prevState => ({ selectedItems: prevState.selectedItems.filter(i => i !== item) }),
      callback,
    );
  }

  /**
   * Add an item to the selectedItems state
   *
   * @param item
   * @param callback
   */
  addSelectedItem(item, callback) {
    this.setState(prevState => ({ selectedItems: [...prevState.selectedItems, item] }), callback);
  }

  /**
   * Downshift's state manager
   *
   * @param state
   * @param changes
   * @return {*}
   */
  stateReducer(state, changes) {
    switch (changes.type) {
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: true,
        };
      default:
        return changes;
    }
  }

  render() {
    return (
      <Downshift
        {...this.props}
        stateReducer={this.stateReducer}
        onChange={this.handleSelection}
        selectedItem={null}
      >
        {downshift => this.props.children(this.getStateAndHelpers(downshift))}
      </Downshift>
    );
  }
}

MultiSelect.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  onChange: PropTypes.func,
  initialSelectedItem: PropTypes.arrayOf(PropTypes.string),
};
MultiSelect.defaultProps = {
  onChange: () => {},
  initialSelectedItem: [],
};

export default MultiSelect;
