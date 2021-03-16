import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DropdownMenu from 'react-dd-menu';
import { Icon } from '../..';
import ui from '../../../../styles/ui-kit.scss';
import styles from './styles.scss';

class DropdownSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };

    this.click = this.click.bind(this);
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
  }

  toggle() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  close() {
    this.setState({ isOpen: false });
  }

  click(optionValue) {
    this.props.onChange(optionValue);
  }

  renderToggleWithCurrentValue() {
    const { options, selected } = this.props;
    const selectedElement = options.find(option => option.value === selected);

    return (
      <button type="button" onClick={this.toggle} className={styles.triggerButton}>
        {selectedElement ? selectedElement.label : null}
        <Icon icon="caret-down" type="solid" />
      </button>
    );
  }

  renderOptions() {
    const { options } = this.props;

    return options.map(option => (
      <li key={option.value}>
        <button type="button" onClick={() => this.click(option.value)}>
          {option.label || option.value}
        </button>
      </li>
    ));
  }

  render() {
    const { label, wrapperClass } = this.props;

    const menuOptions = {
      animate: false,
      isOpen: this.state.isOpen,
      close: this.close,
      toggle: this.renderToggleWithCurrentValue(),
      align: 'right',
      className: classNames(styles.ddContainer, wrapperClass),
    };

    return (
      <div>
        {label && <p className={ui.fieldLabel}>{label}</p>}
        <DropdownMenu {...menuOptions}>{this.renderOptions()}</DropdownMenu>
      </div>
    );
  }
}

DropdownSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
    }),
  ),
  selected: PropTypes.string,
  wrapperClass: PropTypes.string,
};

DropdownSelect.defaultProps = {
  label: null,
  options: [],
  selected: null,
  wrapperClass: null,
};

export default DropdownSelect;
