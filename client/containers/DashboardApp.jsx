
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TopBarContainer from '../containers/TopBarContainer';
import NavRegionContainer from '../containers/NavRegionContainer';
import MainRegionContainer from '../containers/MainRegionContainer';
import { setIsCollapsed } from '../actions/toolbar';
import NavList from '../components/NavList';
import SubTabs from '../components/SubTabs';
import CallerModal from '../components/CallerModal';
import AlertContainer from '../containers/AlertContainer';
import PatientActionsContainer from '../components/Patients/Shared/PatientActionsContainer';
import styles from './styles.scss';

function DashboardApp(props) {
  const { location, children, isCollapsed, isSearchCollapsed } = props;

  let overlay = null;
  if (!isCollapsed) {
    /* eslint-disable */
    overlay = (
      <div className={styles.overlay} onClick={() => this.props.setIsCollapsed(!isCollapsed)} />
    );
    /* eslint-enable */
  }

  let AppContainer = (
    <div>
      <CallerModal />
      <TopBarContainer />
      {overlay}
      <NavRegionContainer>
        <NavList location={location} isCollapsed={isCollapsed} />
      </NavRegionContainer>
      <MainRegionContainer>
        {isSearchCollapsed ? (
          <div className={styles.subTabs}>
            <SubTabs location={location} />
          </div>
        ) : null}
        <div className={styles.mainRegionChildren}>
          {children}
          <AlertContainer />
          <PatientActionsContainer />
        </div>
      </MainRegionContainer>
    </div>
  );

  const isLoginPage = location.pathname.includes('login');

  if (isLoginPage) {
    AppContainer = <div>{children}</div>;
  }

  return AppContainer;
}

DashboardApp.propTypes = {
  children: PropTypes.node,
  activeAccount: PropTypes.shape({}),
  location: PropTypes.shape({}),
  isCollapsed: PropTypes.bool.isRequired,
  isSearchCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

function mapStateToProps({ toolbar, entities, auth }) {
  return {
    isCollapsed: toolbar.get('isCollapsed'),
    isSearchCollapsed: toolbar.get('isSearchCollapsed'),
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      setIsCollapsed,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapActionsToProps,
);

export default enhance(DashboardApp);
