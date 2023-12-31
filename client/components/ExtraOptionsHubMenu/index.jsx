
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Icon } from '../library';
import styles from './styles.scss';

export default class ExtraOptionsMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };

    this.toggle = this.toggle.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  toggle() {
    this.setState(prevState => ({ show: !prevState.show }));
  }

  handleKeyDown(e) {
    if (!this.state.show) {
      return;
    }

    if (e.keyCode === 27) {
      this.toggle();
    }
  }

  renderOptions() {
    return (
      <div className={styles.optionsWrapper}>
        {this.props.options.map(option => (
          <Button
            className={styles.actionOverlayButton}
            onClick={() => {
              this.toggle();
              option.onClick();
            }}
          >
            <Icon icon={option.icon} size={1.5} className={styles.actionOverlayButtonIcon} />
            <span>{option.text}</span>
          </Button>
        ))}
      </div>
    );
  }

  render() {
    const blurFilter = (
      <svg height="0">
        <filter id="blurred">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </svg>
    );

    return (
      <div className={styles.blurContainer}>
        <div
          className={classNames({ [styles.blurBg]: this.state.show })}
          onClick={() => this.state.show && this.toggle()}
          role="button"
          onKeyDown={this.handleKeyDown}
          tabIndex="0"
        >
          <div className={styles.blurredContent}>{this.props.children}</div>
        </div>
        {this.state.show && this.renderOptions()}
        <Button
          dense
          compact
          rounded
          color="blue"
          className={styles.actionButton}
          onClick={this.toggle}
        >
          <Icon icon={this.state.show ? 'minus' : 'plus'} />
        </Button>
        {this.state.show && blurFilter}
      </div>
    );
  }
}

ExtraOptionsMenu.defaultProps = {
  options: [],
};

ExtraOptionsMenu.propTypes = {
  children: PropTypes.node.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
  })),
};
