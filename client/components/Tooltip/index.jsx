import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Popover from 'react-popover';
import styles from './styles.scss';

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.setOpen = this.setOpen.bind(this);
  }

  setOpen(value) {
    this.setState({ isOpen: value });
  }

  render() {
    const { children, body, placement, tipSize, styleOverride, overlayClassName,tooltipPopover} = this.props;
    return (
      <Popover
        className={tooltipPopover ? tooltipPopover : styles.tooltip_Popover}
        isOpen={this.state.isOpen}
        body={[
          <div className={classNames(styleOverride ? styles.light : overlayClassName ? overlayClassName :styles.tooltip_PopoverBody)}>
            {body}
          </div>,
        ]}
        preferPlace={placement || 'right'}
        tipSize={tipSize}
        onOuterAction={() => this.setOpen(false)}
      >
        <div
          className={styles.tooltip}
          onMouseEnter={() => this.setOpen(true)}
          onMouseLeave={() => this.setOpen(false)}
        >
          {children}
        </div>
      </Popover>
    );
  }
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  placement: PropTypes.string,
  styleOverride: PropTypes.string,
  tipSize: PropTypes.number,
};

Tooltip.defaultProps = {
  placement: '',
  styleOverride: '',
  tipSize: 5,
};

export default Tooltip;
