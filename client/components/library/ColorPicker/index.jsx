import React, { Component, PropTypes } from 'react';
import { ChromePicker } from 'react-color';
import Popover from 'react-popover';
import Input from '../Input';
import IconButton from '../IconButton';
import styles from './styles.scss';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleClose() {
    this.setState({ displayColorPicker: false });
  }

  render() {

    const swatchColor = {
      background: this.props.color,
    };

    return (
      <div className={styles.colorPickerContainer}>
        <div className={styles.colorSwatch} style={swatchColor} />
        <Popover
          className={styles.colorPickerPopover}
          onOuterAction={this.handleClose}
          isOpen={this.state.displayColorPicker}
          body={[(
            <ChromePicker
              {...this.props}
            />
          )]}
          preferPlace="below"
          tipSize={12}
        >
          <Input
            label={this.props.label}
            value={this.props.color}
            onChange={this.props.onChange}
            onClick={this.handleClick}
            data-test-id={this.props['data-test-id-child']}
          />
        </Popover>
      </div>
    );
  }
}

export default ColorPicker;
