
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import TopBarContainer from '../containers/TopBarContainer';
import NavRegionContainer from '../containers/NavRegionContainer';
import MainRegionContainer from '../containers/MainRegionContainer';
import { setIsCollapsed } from '../actions/toolbar';
import NavList from '../components/NavList';
import SubTabs from '../components/SubTabs';
import CallerModal from '../components/CallerModal';
import AlertContainer from '../containers/AlertContainer';
import PatientActionsContainer from '../components/Patients/Shared/PatientActionsContainer';
import { locationShape } from '../components/library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

const DashboardApp = ({ location, children }) => {
  if (location.pathname.includes('login')) return <div>{children}</div>;

  const isCollapsed = useSelector(({ toolbar }) => toolbar.get('isCollapsed'));
  const isSearchCollapsed = useSelector(({ toolbar }) => toolbar.get('isSearchCollapsed'));
  return (
    <div>
      <CallerModal />
      <TopBarContainer />
      {!isCollapsed && (
        <div className={styles.overlay} onClick={() => setIsCollapsed(!isCollapsed)} />
      )}
      <NavRegionContainer>
        <NavList location={location} isCollapsed={isCollapsed} />
      </NavRegionContainer>
      <MainRegionContainer>
        {isSearchCollapsed && (
          <div className={styles.subTabs}>
            <SubTabs location={location} />
          </div>
        )}
        <div className={styles.mainRegionChildren}>
          {children}
          <AlertContainer />
          <PatientActionsContainer />
        </div>
      </MainRegionContainer>
    </div>
  );
};

DashboardApp.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
};
export default DashboardApp;
