
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Downshift from 'downshift';
import classNames from 'classnames';
import Selector from './Selector';
import List from './List';
import styles from './styles.scss';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItems: [],
      error: false,
    };

    this.stateReducer = this.stateReducer.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.callbackHandler = this.callbackHandler.bind(this);
    this.addSelectedItem = this.addSelectedItem.bind(this);
  }

  componentDidMount() {
    const { defaultValue, options, selected } = this.props;

    const selectedItems = selected
      ? options.filter(({ value }) => selected.includes(value)).map(({ value }) => value)
      : [];
    const arrayIfString = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    return (selectedItems.length > 0 ? selectedItems : arrayIfString).map(value =>
      this.handleSelection({ value }));
  }

  /**
   * Handles the action after receiveing a selection,
   * either adding or removing the id from the sekectedItems list.
   * Also fire a callback, so we can manage the state on the implementation.
   *
   * @param value
   */
  handleSelection({ value }) {
    if (this.state.selectedItems.includes(value)) {
      this.removeItem(value, this.callbackHandler);
    } else {
      this.addSelectedItem(value, this.callbackHandler);
    }
  }

  callbackHandler() {
    if (this.props.required && this.state.selectedItems.length === 0) {
      return this.setState({ error: true });
    }
    this.setState({ error: false });
    return this.props.onChange(this.state.selectedItems);
  }

  /**
   * Remove an item to the selectedItems state
   *
   * @param item
   * @param callback
   */
  removeItem(item, callback) {
    this.setState(
      prevState => ({
        selectedItems: prevState.selectedItems.filter(i => i !== item),
      }),
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
    if (changes.type === Downshift.stateChangeTypes.clickItem) {
      return {
        ...changes,
        isOpen: true,
      };
    }
    return changes;
  }

  handleHelperLink(hasAvailableItems) {
    return this.setState(
      {
        selectedItems: hasAvailableItems ? this.props.options.map(({ value }) => value) : [],
      },
      this.callbackHandler,
    );
  }

  render() {
    const { label, options, disabled } = this.props;

    const selectedItems = options.filter(({ value }) => this.state.selectedItems.includes(value));
    const availableItems = options.filter(({ value }) => !this.state.selectedItems.includes(value));
    const hasAvailableItems = availableItems.length > 0;
    return (
      <Downshift
        {...this.props}
        stateReducer={this.stateReducer}
        itemToString={item => (item ? item.label : '')}
        onChange={this.handleSelection}
        selectedItem={null}
      >
        {({ getToggleButtonProps, isOpen }) => (
          <div className={styles.selectWrapper}>
            <div className={styles.labelSection}>
              {label && (
                <span
                  className={classNames(styles.fieldLabel, {
                    [styles.error]: this.state.error,
                  })}
                >
                  {label}
                  {this.state.error && ' - Required Field'}
                </span>
              )}
            </div>
            <Selector
              disabled={disabled}
              selected={selectedItems}
              placeholder=""
              error={this.state.error}
              selectorProps={getToggleButtonProps()}
              handleSelection={this.handleSelection}
            />
            <List
              isOpen={isOpen}
              selectedItems={selectedItems}
              availableItems={availableItems}
              hasSelectedItems={selectedItems.length > 0}
              hasAvailableItems={availableItems.length > 0}
              handleSelection={this.handleSelection}
              onChangeAll={() => this.handleHelperLink(hasAvailableItems)}
            />
          </div>
        )}
      </Downshift>
    );
  }
}

const mapStateToProps = ({ featureFlags, entities, auth }) => {
  const defaultAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const options = featureFlags.getIn(['flags', 'multi-account-select']);
  return {
    options: options
      ? options.toJS()
      : [{ label: defaultAccount.get('name'),
        value: defaultAccount.get('id') }],
  };
};

Index.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  onChange: PropTypes.func,
  initialSelectedItem: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
  label: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};
Index.defaultProps = {
  onChange: () => {},
  disabled: false,
  required: false,
  defaultValue: [],
  selected: [],
  label: '',
  initialSelectedItem: [],
};

export default connect(mapStateToProps)(Index);
