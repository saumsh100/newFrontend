
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import Card from '../Card';
import styles from './styles.scss';

class Modal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      active: !!props.active,
    };
    
    this.handleEscKey = this.handleEscKey.bind(this);
    this.deactivate = this.deactivate.bind(this);
  }
  
  componentDidMount() {
    if (this.state.active) {
      document.body.addEventListener('keydown', this.handleEscKey);
    }
  }
  
  componentWillReceiveProps({ active }) {
    console.log('received new props');
    if (this.state.active !== active) {
      this.setState({ active });
    }
  }
  
  componentDidUpdate({ active }) {
    if (active) {
      document.body.addEventListener('keydown', this.handleEscKey);
    } else {
      document.body.removeEventListener('keydown', this.handleEscKey);
    }
  }
  
  
  handleEscKey(e) {
    if (this.state.active && e.which === 27) {
      this.setState({ active: false });
    }
  }
  
  deactivate() {
    this.setState({ active: false });
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
          onClick={this.deactivate}
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
};

export default Modal;
