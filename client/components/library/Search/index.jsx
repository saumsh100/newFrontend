
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import { Icon, Input  } from '../../library';
import enhanceWithClickOutside from 'react-click-outside';

export class Search extends Component {
  constructor(props) {
    super(props);
    this.toggleSearchMode = this.toggleSearchMode.bind(this);
    this.state = {
      searchModeActive: false,
    }
  }

  toggleSearchMode() {
    const { searchModeActive } = this.state;
    this.setState({ searchModeActive: !searchModeActive }); 
  }

  handleClickOutside() {
    this.setState({ searchModeActive: false });
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
        <Icon size={1.4} icon="search" />
        { searchModeActive ?
          <Input 
            placeholder="Search..."
            className={styles.search__searchInput}
            autofocus
            min
          />
        : <span className={styles.search__text} onClick={this.toggleSearchMode}>Search... </span>  }
        <Icon size={1.4} icon="calendar" />
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