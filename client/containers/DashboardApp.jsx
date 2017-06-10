
import React, { PropTypes } from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux'
import TopBarContainer from '../containers/TopBarContainer';
import NavRegionContainer from '../containers/NavRegionContainer';
import MainRegionContainer from '../containers/MainRegionContainer';
import NavList from '../components/NavList';
import SubTabs from '../components/SubTabs';
import AlertContainer from '../containers/AlertContainer';
import { setIsCollapsed } from '../actions/toolbar';
import styles from './styles.scss';

function DashboardApp(props) {
  const {
    location,
    children,
    isCollapsed,
    setIsCollapsed,
  } = props;

  let overlay = null;
  if (!isCollapsed) {
    overlay = <div className={styles.overlay} onClick={() => setIsCollapsed(!isCollapsed)} />;
  }

  let AppContainer = (
    <div>
      <TopBarContainer />
      {overlay}
      <NavRegionContainer>
        <NavList location={location} isCollapsed={isCollapsed} />
      </NavRegionContainer>
      <MainRegionContainer>
        <div className={styles.subTabs}>
          <SubTabs location={location} />
        </div>
        <div className={styles.mainRegionChildren}>
          {children}
          <AlertContainer />
        </div>
      </MainRegionContainer>
    </div>
  );

  const isLoginPage = location.pathname.includes('login');

  if (isLoginPage) {
    AppContainer = (
      <div>
        {children}
      </div>
    );
  }

  return AppContainer;

}

DashboardApp.propTypes = {
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
    dispatch,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(DashboardApp);
