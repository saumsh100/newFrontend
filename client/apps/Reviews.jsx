
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LDClient from 'ldclient-js';
import { Provider, connect } from 'react-redux';
import ReviewsRoutes from '../routes/Reviews';
import ReviewsRoutesFlagged from '../routes/ReviewsV2';
import { historyShape } from '../components/library/PropTypeShapes/routerShapes';
import styles from '../styles/default.scss';

class ReviewsApp extends Component {
  constructor(props) {
    super(props);
    this.state = { flags: null };
  }

  componentDidMount() {
    const envKey =
      process.env.NODE_ENV !== 'production'
        ? JSON.parse(process.env.FEATURE_FLAG_KEY)
        : process.env.FEATURE_FLAG_KEY;

    const client = LDClient.initialize(`${envKey}`, {
      key: 'carecru',
      custom: { accountId: this.props.accountId },
    });
    client.on('ready', () => this.setState({ flags: client.allFlags() }));
  }

  render() {
    const { store, browserHistory } = this.props;
    if (!this.state.flags) {
      return (
        <div className={styles.displayContainer}>
          <i className={'fas fa-spinner fa-spin fa-3x fa-fw'} />
        </div>
      );
    }
    const routingRender = this.state.flags['booking-widget-v2'] ? (
      <ReviewsRoutesFlagged history={browserHistory} />
    ) : (
      <ReviewsRoutes history={browserHistory} />
    );
    return <Provider store={store}>{routingRender}</Provider>;
  }
}

function mapStateToProps({ availabilities }) {
  return {
    accountId: availabilities.get('account').get('id'),
  };
}

export default connect(mapStateToProps, null)(ReviewsApp);

ReviewsApp.propTypes = {
  browserHistory: PropTypes.shape(historyShape),
  accountId: PropTypes.string,
  store: PropTypes.shape({
    liftedStore: PropTypes.object,
    dispatch: PropTypes.func,
    getState: PropTypes.func,
    replaceReducer: PropTypes.func,
    subscribe: PropTypes.func,
  }),
};
