
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import { Icon, Input, Modal, Calendar } from '../../library';
import enhanceWithClickOutside from 'react-click-outside';

export class Search extends Component {
  constructor(props) {
    super(props);
    this.toggleSearchMode = this.toggleSearchMode.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      searchModeActive: false,
      displayModal: false,
    }
  }

  toggleSearchMode() {
    const { searchModeActive } = this.state;
    this.setState({ searchModeActive: !searchModeActive });

  }

  handleClickOutside() {
    this.setState({ searchModeActive: false });
  }

  toggleModal() {
    this.setState({ displayModal: !this.state.displayModal });
  }

  render() {
    const {
      className,
      searchClassName,
    } = this.props;
    const { searchModeActive } = this.state;
    const classes = classNames(styles.search, searchClassName);    
    return (
      <div className={classes}>
        {!searchModeActive && <Icon size={1.4} icon="search" onClick={this.toggleModal} />}
        
        { searchModeActive ?
          <Input 
            placeholder="Search..."
            className={styles.search__searchInput}
            autofocus
            min
            refCallback={(input) => { input && input.focus(); }} 
          />
        : <span className={styles.search__text} onClick={this.toggleSearchMode}>Search... </span>  }
        <Icon size={1.4} icon="calendar" onClick={this.toggleModal} />
          <Modal
            active={this.state.displayModal}
            onEscKeyDown={this.toggleModal}
            onOverlayClick={this.toggleModal}
          >
            <Calendar
            />

          </Modal>
      </div>
      
    );
  }  

}
Icon.defaultProps = {
  size: 1
};
Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
};


export default enhanceWithClickOutside(Search);