
import React, { PropTypes } from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux'
import TopBarContainer from '../containers/TopBarContainer';
import NavRegionContainer from '../containers/NavRegionContainer';
import MainRegionContainer from '../containers/MainRegionContainer';
import NavList from '../components/NavList';
import { setIsCollapsed } from '../actions/toolbar';
import { browserHistory } from 'react-router';
import styles from './styles.scss';

// refactor this to class
// component did mount
// set up redirect to '/' from '/login' if logged in
class App extends React.Component {
  render () {
    const { location, children, isCollapsed, setIsCollapsed, isLoggedIn, user, dispatch } = this.props;
    let overlay;
    if (isCollapsed) {
      overlay = null;
    } else {
      overlay = <div className={styles.overlay} onClick={() => setIsCollapsed(!isCollapsed)} />;
    }
    const isLoginPage = location.pathname.includes('login')

    if (isLoggedIn && isLoginPage) {
      browserHistory.push('/');
    }

    return (
      <div>
        {!isLoginPage && 
          <div>
            <TopBarContainer />
            {overlay}
            <NavRegionContainer>
              <NavList location={location} />
            </NavRegionContainer>
          </div>}
        <MainRegionContainer>
          {children}
        </MainRegionContainer>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

function mapStateToProps({ toolbar, auth }) {
  return {
    isCollapsed: toolbar.get('isCollapsed'),
    isLoggedIn: auth.get('isLoggedIn'),
    user: auth.get('user'),
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    setIsCollapsed,
    dispatch,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(App);
