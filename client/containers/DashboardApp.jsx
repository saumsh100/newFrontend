
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
import { locationShape } from '../components/library/PropTypeShapes/routerShapes';
import styles from './styles.scss';
import { isFeatureEnabledSelector } from '../reducers/featureFlags';
import { fetchWaitingRoomQueue } from '../thunks/waitingRoom';
import { loadUnreadChatCount } from '../thunks/chat';

class DashboardApp extends React.Component {
  constructor(props) {
    super(props);

    this.unreadChatIntervalId = null;
    this.vwrIntervalId = null;
  }

  componentDidUpdate() {
    const { isPollingNeeded } = this.props;

    if (isPollingNeeded) {
      this.startPollingUnreadChats();
      this.startPollingWaitingRoom();
    } else {
      this.resetIntervals();
    }
  }

  componentWillUnmount() {
    this.resetIntervals();
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
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <div
            className={styles.overlay}
            onClick={() => setIsCollapsed(!isCollapsed)}
            role="button"
            tabIndex={0}
          />
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

DashboardApp.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  isCollapsed: PropTypes.PropTypes.bool.isRequired,
  isSearchCollapsed: PropTypes.bool.isRequired,
  isPollingNeeded: PropTypes.bool.isRequired,
  accountId: PropTypes.string.isRequired,
  fetchWaitingRoomQueue: PropTypes.func.isRequired,
  loadUnreadChatCount: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardApp);
