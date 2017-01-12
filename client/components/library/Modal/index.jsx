
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import Card from '../Card';
import styles from './styles.scss';

class Modal extends Component {
  constructor(props) {
    super(props);
    
    this.handleEscKeyDown = this.handleEscKeyDown.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    // this.deactivate = this.deactivate.bind(this);
  }
  
  componentDidMount() {
    if (this.state.active && this.props.onEscKeyDown) {
      document.body.addEventListener('keydown', this.handleEscKey);
    }
  }
  
  componentDidUpdate({ active }) {
    if (active) {
      document.body.addEventListener('keydown', this.handleEscKeyDown);
    } else {
      document.body.removeEventListener('keydown', this.handleEscKeyDown);
    }
  }
  
  
  handleEscKeyDown(e) {
    this.state.active && e.which === 27 && this.props.onEscKeyDown && this.props.onEscKeyDown(e);
  }
  
  handleOverlayClick(e) {
    this.props.onOverlayClick && this.props.onOverlayClick(e);
  }
  
  render() {
    const {
      children,
    } = this.props;
    
    const {
      active,
    } = this.state;
  
    let modalContainerClassName = styles.modalContainer;
    if (active) {
      modalContainerClassName = classNames(styles.active, modalContainerClassName);
    }
  
    const backDropClassName = classNames(styles.backDropDefault);
  
    return (
      <div className={modalContainerClassName}>
        <div
          onClick={this.handleOverlayClick}
          className={backDropClassName}
        />
        <Card className={styles.modalBody}>
          {children}
        </Card>
      </div>
    );
  }
}

Modal.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.object,
  onEscKeyDown: PropTypes.func,
  onOverlayClick: PropTypes.func,
};

export default Modal;
