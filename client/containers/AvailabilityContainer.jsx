
import React, { PropTypes } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { fetchEntities } from '../thunks/fetchEntities';
import styles from './styles.scss';

class Availability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(4, 'd')._d,
      shouldFetchAvailabilities: true,
      retrieveFirstTime: true,
      practitonersStartEndDate: {},
    };
    this.onDoctorChange = this.onDoctorChange.bind(this);
    this.onServiceChange = this.onServiceChange.bind(this);
    this.sixDaysBack = this.sixDaysBack.bind(this);
    this.sixDaysForward = this.sixDaysForward.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'practitioners' });
  }

  componentWillReceiveProps(nextProps) {
    const thisPractitioners = this.props.practitioners.get('models').toArray();
    const nextPractitioners = nextProps.practitioners.get('models').toArray();
    if (!isEqual(thisPractitioners, nextPractitioners)) {
      this.setState({ practitionerId: nextPractitioners[0].id }, () => {
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

        const params = {
          practitionerId: this.state.practitionerId,
          serviceId: this.state.serviceId,
          startDate: this.state.selectedStartDay,
          endDate: this.state.selectedEndDay,
        }
        if (this.state.retrieveFirstTime) {
          params.retrieveFirstTime = this.state.retrieveFirstTime;

        }
        this.props.fetchEntities({ key: 'availabilities',
          params,
        });
      });
    }
    const thisAvailabilities = this.props.availabilities.get('models').toArray();
    const nextAvailabilities = nextProps.availabilities.get('models').toArray();
    if (!isEqual(thisAvailabilities, nextAvailabilities)) {
      const availabilities = nextAvailabilities
        .sort((a, b) => (moment(a.date) > moment(b.date)))
        .filter(a => (a.practitionerId == this.state.practitionerId))


      if (this.state.retrieveFirstTime && availabilities && availabilities.length) {
        // const selectedStartDay = availabilities[0].date;
        // const selectedEndDay = moment(selectedStartDay).add(4, 'days')._d;

        // console.log("selectedStartDay")
        // console.log(selectedStartDay)
        // console.log("selectedEndDay")
        // console.log(selectedEndDay)
        // console.log("availabilities")
        // console.log(availabilities)

        // this.setState({
        //   selectedStartDay,
        //   selectedEndDay,
        // }); 
      }



    }
  }

  onDoctorChange(e) {
    // this.props.fetchEntities({ key: 'services' });
    this.setState({
      practitionerId: e.target.value,
      shouldFetchAvailabilities: true,
      retrieveFirstTime: true,
    }, () => {
      this.props.fetchEntities({ key: 'services',
        params: { practitionerId: this.state.practitionerId }
      });
    })
  }

  onServiceChange(e) {
    this.setState({ serviceId: e.target.value, retrieveFirstTime: false, }, () => {
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

    const { practitonersStartEndDate } = this.state;
    const selectedOldStartDay = practitonersStartEndDate[this.state.practitionerId].selectedStartDay;
    const newEndDay = moment(selectedOldStartDay)._d
    const newStartDay = moment(newEndDay).subtract(4, 'd')._d;
    practitonersStartEndDate[this.state.practitionerId].selectedStartDay = newStartDay;
    practitonersStartEndDate[this.state.practitionerId].selectedEndDay = newEndDay;

    this.setState({
      selectedStartDay: moment(this.state.selectedStartDay).subtract(4, 'd')._d,
      selectedEndDay: moment(this.state.selectedEndDay).subtract(4, 'd')._d,
      shouldFetchAvailabilities: false,
      retrieveFirstTime: false,
      practitonersStartEndDate,
    }, () => {
      this.props.fetchEntities({ key: 'availabilities',
        params: {
          practitionerId: this.state.practitionerId,
          serviceId: this.state.serviceId,
          startDate: newStartDay,
          endDate: newEndDay,
        },
      });
    });
  }

  sixDaysForward() {
    const { practitonersStartEndDate } = this.state;

    const selectedOldStartDay = practitonersStartEndDate[this.state.practitionerId].selectedStartDay;
    const newStartDay = moment(selectedOldStartDay).add(4, 'd')._d;
    const newEndDay = moment(newStartDay).add(4, 'd')._d;
    practitonersStartEndDate[this.state.practitionerId].selectedStartDay = newStartDay;
    practitonersStartEndDate[this.state.practitionerId].selectedEndDay = newEndDay;



    this.setState({
      selectedStartDay: moment(this.state.selectedStartDay).add(4, 'd')._d,
      selectedEndDay: moment(this.state.selectedEndDay).add(4, 'd')._d,
      shouldFetchAvailabilities: false,
      retrieveFirstTime: false,
      practitonersStartEndDate,
    }, () => {
      this.props.fetchEntities({ key: 'availabilities',
        params: {
          practitionerId: this.state.practitionerId,
          serviceId: this.state.serviceId,
          startDate: newStartDay,
          endDate: newEndDay,
        },
      });
    });
  }

  handleDayClick(e, day) {

    const { practitonersStartEndDate } = this.state;

    const selectedOldStartDay = practitonersStartEndDate[this.state.practitionerId].selectedStartDay;
    const newStartDay = day;
    const newEndDay = moment(newStartDay).add(4, 'd')._d;
    practitonersStartEndDate[this.state.practitionerId].selectedStartDay = newStartDay;
    practitonersStartEndDate[this.state.practitionerId].selectedEndDay = newEndDay;
    console.log(day, 'the DAY');
    this.setState({
      selectedStartDay: day,
      selectedEndDay: moment(day).add(4, 'd')._d,
      shouldFetchAvailabilities: false,
      retrieveFirstTime: false,
      practitonersStartEndDate,      
    }, () => {
      console.log(this.state.selectedStartDay, this.state.selectedEndDay);
      this.props.fetchEntities({ key: 'availabilities',
        params: {
          practitionerId: this.state.practitionerId,
          serviceId: this.state.serviceId,
          startDate: newStartDay,
          endDate: newEndDay,
        },
      });
    });
  }

  render() {

    const sortedByDate = this.props.availabilities.get('models')
      .toArray()
      .filter(a => a.practitionerId === this.state.practitionerId)
      .sort((a, b) => {
        if (moment(a.date) > moment(b.date)) return 1;
        if (moment(a.date) < moment(b.date)) return -1;
        return 0;
      })

      let selectedStartDay = this.state.selectedStartDay
      let selectedEndDay = this.state.selectedEndDay;

      const practitonersStartEndDate = this.state.practitonersStartEndDate; 
      
      if (!practitonersStartEndDate[this.state.practitionerId] && sortedByDate && sortedByDate.length) {
      
        selectedStartDay = sortedByDate[0].date;
        selectedEndDay = moment(selectedStartDay).add(4, 'days')._d;
        practitonersStartEndDate[this.state.practitionerId] = {
          selectedStartDay: sortedByDate[0].date,
          selectedEndDay:  moment(selectedStartDay).add(4, 'days')._d,
        }
        this.setState({ practitonersStartEndDate });

      }

      if (practitonersStartEndDate[this.state.practitionerId]) {
        selectedStartDay = practitonersStartEndDate[this.state.practitionerId].selectedStartDay;
        selectedEndDay = practitonersStartEndDate[this.state.practitionerId].selectedEndDay;
      }

      const filteredByDoctor = sortedByDate
      .filter(a =>
        moment(a.date).isBetween(selectedStartDay, selectedEndDay, 'days', true)
      );

        console.log("selectedStartDay")
        console.log(selectedStartDay)
        console.log("selectedEndDay")
        console.log(selectedEndDay)



      console.log(moment(this.state.selectedEndDay).format('MMMM Do YYYY, h:mm:ss a'))
      console.log(filteredByDoctor, 'filteredByDoctor');
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
          <DayPicker
            onDayClick={ this.handleDayClick }
            selectedDays={ this.isDaySelected }
          />
        </div>
          {filteredByDoctor.map(av => {
            return (<ul className={styles.ulHeader} key={av.date}> {moment(av.date).format('YYYY-MM-DD')}
              {av.availabilities.map(slot =>
                <li className={styles.listItem}
                  key={slot.startsAt}
                >
                  {moment(slot.startsAt).format('HH:mm')}
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
