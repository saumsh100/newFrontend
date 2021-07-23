import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '../Card';
import styles from './styles.scss';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.handleEscKeyDown = this.handleEscKeyDown.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.deactivate = this.deactivate.bind(this);
  }

  componentDidMount() {
    if (this.props.active && this.props.onEscKeyDown) {
      document.body.addEventListener('keydown', this.handleEscKeyDown);
    }
  }

  componentDidUpdate() {
    if (this.props.active) {
      document.body.addEventListener('keydown', this.handleEscKeyDown);
    } else {
      document.body.removeEventListener('keydown', this.handleEscKeyDown);
    }
  }

  handleEscKeyDown(e) {
    this.props.active && e.which === 27 && this.props.onEscKeyDown && this.props.onEscKeyDown(e);
  }

  handleOverlayClick(e) {
    this.props.onOverlayClick && this.props.onOverlayClick(e);
  }

  deactivate(e) {
    this.props.onOverlayClick && this.props.onOverlayClick(e);
  }

  render() {
    const {
      children,
      active,
      type,
      custom,
      className,
      showOverlay,
      containerStyles,
      bodyStyles,
      backDropStyles,
    } = this.props;

    const modalContainerClassName = classNames(styles.modalContainer, containerStyles, {
      [styles.active]: active,
    });

    const modalBodyClassName = classNames(className, styles.modalBody, bodyStyles, {
      [styles[type]]: !custom && type,
    });

    const backDropClassName = classNames(styles.backDropDefault, backDropStyles);

    return (
      <div className={modalContainerClassName}>
        {showOverlay && (
          <div
            role="presentation"
            onClick={() => {
              this.handleOverlayClick();
            }}
            className={backDropClassName}
          />
        )}
        <Card className={modalBodyClassName} noBorder>
          {children}
        </Card>
      </div>
    );
  }
}

Modal.propTypes = {
  active: PropTypes.bool,
  backDropStyles: PropTypes.string,
  bodyStyles: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  containerStyles: PropTypes.string,
  custom: PropTypes.bool,
  onEscKeyDown: PropTypes.func,
  onOverlayClick: PropTypes.func,
  showOverlay: PropTypes.bool,
  type: PropTypes.string,
};

Modal.defaultProps = {
  active: false,
  backDropStyles: null,
  bodyStyles: '',
  children: null,
  className: null,
  containerStyles: null,
  custom: false,
  onEscKeyDown: null,
  onOverlayClick: null,
  showOverlay: true,
  type: 'medium',
};

export default Modal;
