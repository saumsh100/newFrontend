
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import Card from '../Card';
import styles from './styles.scss';
import Icon from '../Icon';
import CardHeader from '../CardHeader';
import Button from '../Button';
import RemoteSubmitButton from '../Form/RemoteSubmitButton';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.handleEscKeyDown = this.handleEscKeyDown.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.deactivate = this.deactivate.bind(this);
  }

  componentDidMount() {
    if (this.props.active && this.props.onEscKeyDown) {
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

  deactivate(e){
    this.props.onOverlayClick && this.props.onOverlayClick(e);
  }


  handleEscKeyDown(e) {
    this.props.active && e.which === 27 && this.props.onEscKeyDown && this.props.onEscKeyDown(e);
  }

  handleOverlayClick(e) {
    this.props.onOverlayClick && this.props.onOverlayClick(e);
  }

  render() {
    const {
      children,
      active,
      actions,
      title,
    } = this.props;

    let modalContainerClassName = styles.modalContainer;
    if (active) {
      modalContainerClassName = classNames(styles.active, modalContainerClassName);
    }

    let showFooterComponent = null;
    if (actions) {
      showFooterComponent = (
        <div className={styles.modalBody__footer}>
          {actions.map((action) => {
            return (
              <RemoteSubmitButton form={action.form} onClick={action.onClick}>
                {action.label}
              </RemoteSubmitButton>
            );
          })}
        </div>
      );
    }

    const backDropClassName = classNames(styles.backDropDefault);

    return (
      <div className={modalContainerClassName}>
        <div
          onClick={this.handleOverlayClick}
          className={backDropClassName}
        />
        <Card className={styles.modalBody}>
          <div className={styles.modalBody__modalHeader}>
            <CardHeader title={title} />
            <Icon
              icon="times"
              className={styles.modalBody__closeIcon}
              onClick={this.deactivate}
            />
          </div>
          {children}
          {showFooterComponent}
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
