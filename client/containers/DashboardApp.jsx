import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import loadable from '@loadable/component';
import classNames from 'classnames';
import TopBarContainer from './TopBarContainer';
import NavRegionContainer from './NavRegionContainer';
import MainRegionContainer from './MainRegionContainer';
import { setIsCollapsed } from '../actions/toolbar';
import NavList from '../components/NavList';
import CallerModal from '../components/CallerModal';
import AlertContainer from './AlertContainer';
import PatientActionsContainer from '../components/Patients/Shared/PatientActionsContainer';
import { locationShape } from '../components/library/PropTypeShapes/routerShapes';
import styles from './styles.scss';
import { isFeatureEnabledSelector } from '../reducers/featureFlags';
import { fetchWaitingRoomQueue } from '../thunks/waitingRoom';
import { loadUnreadChatCount } from '../thunks/chat';
import MicroFrontendRenderer from '../micro-front-ends/MicroFrontendRenderer';

// eslint-disable-next-line import/no-unresolved
const EmSwitcher = loadable(() => import('EM_MFE/EmSwitcher'));

const DashboardApp = (props) => {
  let unreadChatIntervalId = null;
  let vwrIntervalId = null;
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  useEffect(() => {
    setupPolling();
    return () => resetIntervals();
  });

  const setupPolling = () => {
    const { isPollingNeeded } = props;

    if (isPollingNeeded) {
      startPollingUnreadChats();
      startPollingWaitingRoom();
    } else {
      resetIntervals();
    }
  };

  const initiatePolling = ({ interval, pollFn }) => {
    return setInterval(() => pollFn(), interval * 1000);
  };

  const startPollingUnreadChats = () => {
    if (!unreadChatIntervalId) {
      unreadChatIntervalId = initiatePolling({
        interval: Number(process.env.POLLING_UNREAD_CHAT_INTERVAL || '300'),
        pollFn: () => props.loadUnreadChatCount(),
      });
    }
  };

  const startPollingWaitingRoom = () => {
    if (!vwrIntervalId) {
      vwrIntervalId = initiatePolling({
        interval: Number(process.env.POLLING_VWR_INTERVAL || '60'),
        pollFn: () => props.fetchWaitingRoomQueue({ accountId: props.accountId }),
      });
    }
  };

  const resetIntervals = () => {
    clearInterval(unreadChatIntervalId);
    clearInterval(vwrIntervalId);

    unreadChatIntervalId = null;
    vwrIntervalId = null;
  };

  const { location, children, enterpriseManagementPhaseTwoActive, isCollapsed, isHovered } = props;

  if (location.pathname.includes('login') || location.pathname.includes('enterprise-management')) {
    return <div>{children}</div>;
  }
  return (
    <div>
      <CallerModal />
      <TopBarContainer />
      {!isCollapsed && (
        <div
          className={styles.overlay}
          onClick={() => setIsCollapsed(!isCollapsed)}
          role="button"
          label="collapse"
          onKeyDown={() => null}
          tabIndex={0}
        />
      )}
      <NavRegionContainer
        className={classNames({
          [styles.sideNavWidth_expanded]: isHovered || !isCollapsed || isSidebarHovered,
          [styles.sideNavWidth_collapsed]: !(isHovered || !isCollapsed || isSidebarHovered),
          [styles.sideNavWidth_expanded_activeMenu]: isCollapsed,
        })}
        setIsSidebarHovered={setIsSidebarHovered}
      >
        <NavList location={location} />
        <MicroFrontendRenderer
          load={enterpriseManagementPhaseTwoActive}
          component={
            <EmSwitcher inverted isCollapsed={!(isHovered || !isCollapsed || isSidebarHovered)} />
          }
          className={styles.emSwitcher}
        />
      </NavRegionContainer>
      <MainRegionContainer>
        <div className={styles.mainRegionChildren}>
          {children}
          <AlertContainer />
          <PatientActionsContainer />
        </div>
      </MainRegionContainer>
    </div>
  );
};

function mapStateToProps({ featureFlags, toolbar, auth }) {
  const isPollingNeeded = isFeatureEnabledSelector(featureFlags.get('flags'), 'is-polling-needed');

  return {
    isPollingNeeded,
    isCollapsed: toolbar.get('isCollapsed'),
    isHovered: toolbar.get('isHovered'),
    isSearchCollapsed: toolbar.get('isSearchCollapsed'),
    accountId: auth.get('accountId'),
    enterpriseManagementPhaseTwoActive: featureFlags.getIn([
      'flags',
      'enterprise-management-phase-2',
    ]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchWaitingRoomQueue,
      loadUnreadChatCount,
    },
    dispatch,
  );
}

DashboardApp.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  isCollapsed: PropTypes.PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  isPollingNeeded: PropTypes.bool.isRequired,
  accountId: PropTypes.string.isRequired,
  fetchWaitingRoomQueue: PropTypes.func.isRequired,
  loadUnreadChatCount: PropTypes.func.isRequired,
  enterpriseManagementPhaseTwoActive: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardApp);
