import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Loader from 'react-loader';
import jwt from 'jwt-decode';
import PhoneGraph from './PhoneGraph';
import PhoneCalls from './PhoneCalls';
import { fetchEntitiesRequest, fetchEntities, createEntityRequest, updateEntityRequest } from '../../../thunks/fetchEntities';
import styles from './styles.scss';
import * as Actions from '../../../actions/entities';


class Phone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endDate: moment(),
      startDate: moment().subtract(1, 'months'),
      active: false,
      loader: false,
      skip: 0,
      limit: 7,
      moreData: true,
    };
    this.loadMore = this.loadMore.bind(this);
    this.newGraph = this.newGraph.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    const params = {
      startDate: this.state.startDate._d,
      endDate: this.state.endDate._d,
      accountId: decodedToken.activeAccountId,
      skip: this.state.skip,
      limit: this.state.limit,
    };

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'callGraphStats',
        url: '/api/calls/statsgraph',
        params,
      }),
      this.props.fetchEntities({
        id: 'calls',
        url: '/api/calls/',
        join: ['patient'],
        params,
      }),
    ])
      .then(() => {
        this.setState({
          loader: true,
          skip: this.state.skip + 7,
          limit: this.state.limit + 7,
        });
      });
  }

  loadMore() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    const params = {
      startDate: this.state.startDate._d,
      endDate: this.state.endDate._d,
      accountId: decodedToken.activeAccountId,
      skip: this.state.skip,
      limit: this.state.limit,
    };

    this.props.fetchEntities({
      id: 'calls',
      url: '/api/calls/',
      join: ['patient'],
      params,
    }).then((calls) => {
      const moreData = Object.keys(calls).length !== 0;
      this.setState({
        skip: this.state.skip + 7,
        limit: this.state.limit + 7,
        moreData,
      });
    });
  }

  newGraph(values) {
    this.setState({
      loader: false,
    });
    this.props.deleteAllEntity('calls')

    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    const params = {
      startDate: moment(values.startDate)._d,
      endDate: moment(values.endDate)._d,
      accountId: decodedToken.activeAccountId,
      skip: 0,
      limit: 7,
    };

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'callGraphStats',
        url: '/api/calls/statsgraph',
        params,
      }),
      this.props.fetchEntities({
        id: 'calls',
        url: '/api/calls/',
        join: ['patient'],
        params,
      }),
    ]).then(() => {
      this.setState({
        startDate: moment(values.startDate),
        endDate: moment(values.endDate),
        loader: true,
        moreData: true,
        skip: 7,
        limit: 14,
      });
    });
  }

  render() {
    const {
      callGraphStats,
      calls,
      patients,
    } = this.props;

    return (
      <div className={styles.fill}>
        <Loader loaded={this.state.loader} color="#FF715C">
          <PhoneGraph
            callGraphStats={callGraphStats}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            submit={this.newGraph}
          />
          <PhoneCalls
            calls={calls}
            callGraphStats={callGraphStats}
            patients={patients}
            loadMore={this.loadMore}
            moreData={this.state.moreData}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        </Loader>
      </div>
    );
  }
}

Phone.propTypes = {
  appointments: PropTypes.object,
  callGraphStats: PropTypes.object,
  patients: PropTypes.object,
  calls: PropTypes.object,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  deleteAllEntity: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, apiRequests }) {
  const callGraphStats = (apiRequests.get('callGraphStats') ? apiRequests.get('callGraphStats') : null);
  let calls = entities.getIn(['calls', 'models']);
  const patients = entities.getIn(['patients', 'models']);

  if (calls) {
    calls = calls.toArray().sort((a, b) => moment(b.startTime).diff(a.startTime));
  }
  return {
    callGraphStats,
    calls,
    patients,
    appointments: entities.getIn(['appointments', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
    createEntityRequest,
    updateEntityRequest,
    fetchEntities,
    deleteAllEntity: Actions.deleteAllEntity,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Phone);
