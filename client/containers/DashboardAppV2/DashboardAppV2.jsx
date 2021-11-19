import PropTypes from 'prop-types';
import React, { lazy } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  TopBarContainerV2,
  NavRegionContainerV2,
  MainRegionContainerV2,
  NavListV2,
} from './components';
import { setIsCollapsed } from '../../actions/toolbar';
import SubTabs from '../../components/SubTabs';
import CallerModal from '../../components/CallerModal';
import AlertContainer from '../AlertContainer';
import PatientActionsContainer from '../../components/Patients/Shared/PatientActionsContainer';
import { locationShape } from '../../components/library/PropTypeShapes/routerShapes';
import styles from './styles-v2.scss';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';
import { fetchWaitingRoomQueue } from '../../thunks/waitingRoom';
import { loadUnreadChatCount } from '../../thunks/chat';
import '@carecru/component-library/dist/carecru.css';

const EmAvatarWidget = lazy(() => import('EM_MFE/EmAvatarWidget'));
class DashboardAppV2 extends React.Component {
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
        <TopBarContainerV2 />
        {!isCollapsed && (
          <div
            className={styles.overlay}
            onClick={() => setIsCollapsed(!isCollapsed)}
            role="button"
            label="collapse"
            onKeyDown={() => {}}
            tabIndex={0}
          />
        )}
        <NavRegionContainerV2>
          <NavListV2 location={location} isCollapsed={isCollapsed} />
          <div className={styles.emNavFooter}>
            <React.Suspense fallback="Loading Avatar..">
              <EmAvatarWidget
                isCollapsed={isCollapsed}
                style={isCollapsed ? {} : { minWidth: 135 }}
              />
            </React.Suspense>
          </div>
        </NavRegionContainerV2>
        <MainRegionContainerV2>
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
        </MainRegionContainerV2>
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

DashboardAppV2.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  isCollapsed: PropTypes.PropTypes.bool.isRequired,
  isSearchCollapsed: PropTypes.bool.isRequired,
  isPollingNeeded: PropTypes.bool.isRequired,
  accountId: PropTypes.string.isRequired,
  fetchWaitingRoomQueue: PropTypes.func.isRequired,
  loadUnreadChatCount: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardAppV2);
