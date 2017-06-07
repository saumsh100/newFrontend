import React, { Component, PropTypes } from 'react';
import { ChromePicker } from 'react-color';
import Button from '../Button';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleClose() {
    this.setState({ displayColorPicker: false });
  }

  render() {
    const popover = {
      position: 'absolute',
      zIndex: '2',
    };
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    };

    return (
      <div>
        <Button onClick={this.handleClick}>Pick Color</Button>
        { this.state.displayColorPicker ?
          <div style={popover}>
            <div style={cover} onClick={ this.handleClose } />
            <ChromePicker
              {...this.props}
            />
          </div>
          : null }
      </div>
    );
  }
}

export default ColorPicker;
