import PropTypes from 'prop-types';
import React, { lazy } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TopBarContainer from './TopBarContainer';
import NavRegionContainer from './NavRegionContainer';
import MainRegionContainer from './MainRegionContainer';
import { setIsCollapsed } from '../actions/toolbar';
import NavList from '../components/NavList';
import SubTabs from '../components/SubTabs';
import CallerModal from '../components/CallerModal';
import AlertContainer from './AlertContainer';
import PatientActionsContainer from '../components/Patients/Shared/PatientActionsContainer';
import { locationShape } from '../components/library/PropTypeShapes/routerShapes';
import styles from './styles.scss';
import { isFeatureEnabledSelector } from '../reducers/featureFlags';
import { fetchWaitingRoomQueue } from '../thunks/waitingRoom';
import { loadUnreadChatCount } from '../thunks/chat';

// eslint-disable-next-line import/no-unresolved
const EmAvatarWidget = lazy(() => import('EM_MFE/EmAvatarWidget'));

class DashboardApp extends React.Component {
  constructor(props) {
    super(props);

    this.unreadChatIntervalId = null;
    this.vwrIntervalId = null;
  }

  componentDidMount() {
    this.setupPolling();
  }

  componentDidUpdate() {
    this.setupPolling();
  }

  componentWillUnmount() {
    this.resetIntervals();
  }

  setupPolling() {
    const { isPollingNeeded } = this.props;

    if (isPollingNeeded) {
      this.startPollingUnreadChats();
      this.startPollingWaitingRoom();
    } else {
      this.resetIntervals();
    }
  }

  initiatePolling({ interval, pollFn }) {
    return setInterval(() => pollFn(), interval * 1000);
  }

  startPollingUnreadChats() {
    if (!this.unreadChatIntervalId) {
      this.unreadChatIntervalId = this.initiatePolling({
        interval: Number(process.env.POLLING_UNREAD_CHAT_INTERVAL || '300'),
        pollFn: () => this.props.loadUnreadChatCount(),
      });
    }
  }

  startPollingWaitingRoom() {
    if (!this.vwrIntervalId) {
      this.vwrIntervalId = this.initiatePolling({
        interval: Number(process.env.POLLING_VWR_INTERVAL || '60'),
        pollFn: () => this.props.fetchWaitingRoomQueue({ accountId: this.props.accountId }),
      });
    }
  }

  resetIntervals() {
    clearInterval(this.unreadChatIntervalId);
    clearInterval(this.vwrIntervalId);

    this.unreadChatIntervalId = null;
    this.vwrIntervalId = null;
  }

  render() {
    const { location, children } = this.props;

    if (location.pathname.includes('login')) return <div>{children}</div>;

    const { isCollapsed, isSearchCollapsed } = this.props;

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
        <NavRegionContainer>
          <NavList location={location} isCollapsed={isCollapsed} />

          {this.props.enterpriseManagementPhaseTwoActive && (
            <div className={styles.emNavFooter}>
              <React.Suspense fallback="Loading Avatar..">
                <EmAvatarWidget
                  isCollapsed={isCollapsed}
                  style={isCollapsed ? {} : { minWidth: 135 }}
                />
              </React.Suspense>
            </div>
          )}
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
  }
}

function mapStateToProps({ featureFlags, toolbar, auth }) {
  const isPollingNeeded = isFeatureEnabledSelector(featureFlags.get('flags'), 'is-polling-needed');

  return {
    isPollingNeeded,
    isCollapsed: toolbar.get('isCollapsed'),
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
  isSearchCollapsed: PropTypes.bool.isRequired,
  isPollingNeeded: PropTypes.bool.isRequired,
  accountId: PropTypes.string.isRequired,
  fetchWaitingRoomQueue: PropTypes.func.isRequired,
  loadUnreadChatCount: PropTypes.func.isRequired,
  enterpriseManagementPhaseTwoActive: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardApp);
