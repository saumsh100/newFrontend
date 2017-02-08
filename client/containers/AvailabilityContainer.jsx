
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { fetchEntities } from '../thunks/fetchEntities';
import styles from './styles.scss';

class Availability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(6, 'd')._d,
      shouldFetchAvailabilities: true,
    };
    this.onDoctorChange = this.onDoctorChange.bind(this);
    this.onServiceChange = this.onServiceChange.bind(this);
    this.sixDaysBack = this.sixDaysBack.bind(this);
    this.sixDaysForward = this.sixDaysForward.bind(this);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'practitioners' });
  }

  componentWillReceiveProps(nextProps) {
    const thisPractitioners = this.props.practitioners.get('models').toArray();
    const nextPractitioners = nextProps.practitioners.get('models').toArray();
    if (!isEqual(thisPractitioners, nextPractitioners)) {
      this.setState({ practitionerId: nextPractitioners[0].id }, () =>{
        this.props.fetchEntities({ key: 'services',
          params: { practitionerId: this.state.practitionerId }
        });
      });
    }
    const thisServices = this.props.services.get('models').toArray();
    const nextServices = nextProps.services.get('models').toArray();
    if (!isEqual(thisServices, nextServices)) {
      this.setState({ serviceId: nextServices
        .filter(s =>
          includes(s.practitioners, this.state.practitionerId)
        )[0].id }, () => {
        this.props.fetchEntities({ key: 'availabilities',
          params: {
            practitionerId: this.state.practitionerId,
            serviceId: this.state.serviceId,
            startDate: this.state.selectedStartDay,
            endDate: this.state.selectedEndDay,
          },
        });
      });
    }
    const thisAvailabilities = this.props.availabilities.get('models').toArray();
    const nextAvailabilities = nextProps.availabilities.get('models').toArray();
    if (!isEqual(thisAvailabilities, nextAvailabilities)) {
      const availabilities = nextAvailabilities
        .sort((a, b) => {
          if (moment(a.date) > moment(b.date)) return 1;
          if (moment(a.date) < moment(b.date)) return -1;
          return 0;
        });
      const soonestAvailableDay = availabilities.filter(a => a.availabilities.length > 0)[0];
      if (!(moment(soonestAvailableDay.date).isSame(this.state.selectedStartDay, 'd') &&
          moment(soonestAvailableDay.date).isSame(this.state.selectedStartDay, 'year') &&
          moment(soonestAvailableDay.date).isSame(this.state.selectedStartDay, 'month')) &&
          this.state.shouldFetchAvailabilities) {
        this.setState({
          selectedStartDay: moment(soonestAvailableDay.date)._d,
          selectedEndDay: moment(soonestAvailableDay.date).add(6, 'd')._d,
        }, () => {
          console.log(this.state.selectedStartDay, this.state.selectedEndDay);
          this.props.fetchEntities({ key: 'availabilities',
            params: {
              practitionerId: this.state.practitionerId,
              serviceId: this.state.serviceId,
              startDate: this.state.selectedStartDay,
              endDate: this.state.selectedEndDay,
            },
          });
        });
      }
    }
  }

  onDoctorChange(e) {
    // this.props.fetchEntities({ key: 'services' });
    this.setState({ 
      practitionerId: e.target.value,
      shouldFetchAvailabilities: true,
      }, () => {
      this.props.fetchEntities({ key: 'services',
        params: { practitionerId: this.state.practitionerId }
      });
    })
  }

  onServiceChange(e) {
    this.setState({ serviceId: e.target.value }, () => {
      // this.props.preventEntityDuplication({ key: 'availabilities' });
      this.props.fetchEntities({ key: 'availabilities',
        params: {
          practitionerId: this.state.practitionerId,
          serviceId: this.state.serviceId,
          startDate: this.state.selectedStartDay,
          endDate: this.state.selectedEndDay,
        },
      });
    });
  }

  sixDaysBack() {
    this.setState({
      selectedStartDay: moment(this.state.selectedStartDay).subtract(6, 'd')._d,
      selectedEndDay: moment(this.state.selectedEndDay).subtract(6, 'd')._d,
      shouldFetchAvailabilities: false,
    }, () => {
      this.props.fetchEntities({ key: 'availabilities',
        params: {
          practitionerId: this.state.practitionerId,
          serviceId: this.state.serviceId,
          startDate: this.state.selectedStartDay,
          endDate: this.state.selectedEndDay,
        },
      });
    });
  }

  sixDaysForward() {
    this.setState({
      selectedStartDay: moment(this.state.selectedStartDay).add(6, 'd')._d,
      selectedEndDay: moment(this.state.selectedEndDay).add(6, 'd')._d,
      shouldFetchAvailabilities: false,
    }, () => {
      console.log(this.state.selectedStartDay, this.state.selectedEndDay)
      this.props.fetchEntities({ key: 'availabilities',
        params: {
          practitionerId: this.state.practitionerId,
          serviceId: this.state.serviceId,
          startDate: this.state.selectedStartDay,
          endDate: this.state.selectedEndDay,
        },
      });
    });
  }

  render() {
    const filteredByDoctor = this.props.availabilities.get('models')
      .toArray()
      .filter(a => a.practitionerId === this.state.practitionerId)
      .sort((a, b) => {
        if (moment(a.date) > moment(b.date)) return 1;
        if (moment(a.date) < moment(b.date)) return -1;
        return 0;
      })
      .filter((a, i) => {
        if (i === 0) {
          return (moment(a.date).isSame(moment(this.state.selectedStartDay), 'd')
          && moment(a.date) <= moment(this.state.selectedEndDay))
        }
        return (moment(a.date) >= moment(this.state.selectedStartDay)
        && moment(a.date) <= moment(this.state.selectedEndDay))
      });

      console.log(filteredByDoctor);

    return (
      <div>
        <div className={styles.header}>
          <button onClick={this.sixDaysBack}>Back</button>
          <select
            className={styles.selects}
            value={this.state.practitionerId}
            onChange={this.onDoctorChange}
            ref={(doctor) => { this.doctor = doctor; }}
          >
            {this.props.practitioners.get('models').toArray().map(p =>
              <option value={p.id} key={p.id}>{p.getFullName()}</option>
            )}
          </select>
          <select
            className={styles.selects}
            onChange={this.onServiceChange}
            ref={(service) => { this.service = service; }}
          >
            {this.props.services.get('models').toArray().filter(s =>
              includes(s.practitioners, this.state.practitionerId)
            ).map(s =>
              <option value={s.id} key={s.id}>{s.name}</option>
            )}
          </select>
          <button onClick={this.sixDaysForward}>Forward</button>
        </div>
          {filteredByDoctor.map(av => {
            return (<ul className={styles.ulHeader} key={av.date}> {moment(av.date).format('YYYY-MM-DD')}
              {av.availabilities.map(item =>
                <li className={styles.listItem}
                  key={item}
                >
                  {moment(item).format('HH:mm')}
                </li>)
              }
            </ul>);
          })}

      </div>
    );
  }
}

function mapStateToProps({ entities }) {
  return {
    availabilities: entities.get('availabilities'),
    services: entities.get('services'),
    practitioners: entities.get('practitioners'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Availability);
