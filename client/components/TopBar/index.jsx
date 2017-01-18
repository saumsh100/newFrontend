
import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import { AppBar, Button } from '../library';
import styles from './styles.scss';


class TopBar extends Component {
  constructor(props) {
    super(props);
    
    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.setItem('token', '');
    browserHistory.push('/login');
    this.props.logout();
  }

  render() {
    const { isCollapsed, setIsCollapsed } = this.props;
    const topBarClassName = classNames(
      styles.topBarContainer,
      isCollapsed ?
        styles.topBarContainerCollapsed :
        styles.topBarContainerUnCollapsed
    );
    
    return (
      <AppBar className={topBarClassName}>
        <div
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i
            className="fa fa-bars"
          />
        </div>
        <Button onClick={this.logout}>Log Out</Button>
      </AppBar>
    );
  }
}

TopBar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

export default TopBar;
