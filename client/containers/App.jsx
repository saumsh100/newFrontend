
import React, { PropTypes } from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TopBarContainer from '../containers/TopBarContainer';
import NavRegionContainer from '../containers/NavRegionContainer';
import MainRegionContainer from '../containers/MainRegionContainer';
import NavList from '../components/NavList';
import { setIsCollapsed } from '../actions/toolbar';
import styles from './styles.scss';

// refactor this to class
// component did mount
// set up redirect to '/' from '/login' if logged in
function App({ location, children, isCollapsed, setIsCollapsed }) {
  let overlay;
  if (isCollapsed) {
    overlay = null;
  } else {
    overlay = <div className={styles.overlay} onClick={() => setIsCollapsed(!isCollapsed)} />;
  }

  return (
    <div>
      <TopBarContainer />
      {overlay}
      <NavRegionContainer>
        <NavList location={location} />
      </NavRegionContainer>
      <MainRegionContainer>
        {children}
      </MainRegionContainer>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

function mapStateToProps({ toolbar }) {
  return {
    isCollapsed: toolbar.get('isCollapsed'),
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    setIsCollapsed,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(App);
