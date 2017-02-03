
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import DayPicker, { DateUtils } from 'react-day-picker';
import "react-day-picker/lib/style.css";
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { fetchEntities } from '../thunks/fetchEntities';
import styles from './styles.scss';

class Availability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(5, 'd')._d,
    };
    this.onDoctorChange = this.onDoctorChange.bind(this);
    this.handleStartDay = this.handleStartDay.bind(this);
    this.handleEndDay = this.handleEndDay.bind(this);
    this.isStartDaySelected = this.isStartDaySelected.bind(this);
    this.isEndDaySelected = this.isEndDaySelected.bind(this);
    this.onServiceChange = this.onServiceChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'practitioners' });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.practitioners.get('models').toArray(),
      nextProps.practitioners.get('models').toArray())) {
      this.setState({ practitionerId: nextProps.practitioners.get('models').toArray()[0].id }, () =>{
        this.props.fetchEntities({ key: 'services',
          params: { practitionerId: this.state.practitionerId }
        });
      });
    }
    if (!isEqual(this.props.services.get('models').toArray(),
      nextProps.services.get('models').toArray())) {
      this.setState({ serviceId: nextProps.services.get('models').toArray()[0].id }, () => {
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
    console.log('here')
  }

  onDoctorChange(e) {
    // this.props.fetchEntities({ key: 'services' });
    this.setState({ practitionerId: e.target.value }, () => {
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

  isStartDaySelected(day) {
    return DateUtils.isSameDay(day, this.state.selectedStartDay);
  }

  isEndDaySelected(day) {
    return DateUtils.isSameDay(day, this.state.selectedEndDay);
  }

  handleStartDay(e, day) {
    this.setState({ selectedStartDay: day }, () => {
      this.setState({ selectedEndDay: moment(this.state.selectedStartDay).add(5, 'd')._d }, () => {
        console.log(this.state.selectedStartDay, this.state.selectedEndDay);
        console.log(moment(this.state.selectedEndDay) - moment(this.state.selectedStartDay));
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
    });
  }

  handleEndDay(e, day) {
    this.setState({ selectedEndDay: day }, () => {
      console.log(moment(this.state.selectedEndDay) - moment(this.state.selectedStartDay));
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

  render() {
    const filteredByDoctor = this.props.availabilities.get('models')
      .toArray()
      .filter(a => a.practitionerId === this.state.practitionerId)
      .filter(a => (moment(a.date) >= moment(this.state.selectedStartDay)) &&
        (moment(a.date) <= moment(this.state.selectedEndDay)))
      .sort((a, b) => {
        if (moment(a.date) > moment(b.date)) return 1;
        if (moment(a.date) < moment(b.date)) return -1;
        return 0;
      });

    console.log(filteredByDoctor);
    return (
      <div>
        <div className={styles.header}>
          <select className={styles.selects} onChange={this.onDoctorChange}>
            {this.props.practitioners.get('models').toArray().map(p =>
              <option value={p.id} key={p.id}>{p.getFullName()}</option>
            )}
          </select>
          <select className={styles.selects} onChange={this.onServiceChange}>
            {this.props.services.get('models').toArray().filter(s =>
              includes(s.practitioners, this.state.practitionerId)
            ).map(s =>
              <option value={s.id} key={s.id}>{s.name}</option>
            )}
          </select>
          <div><i class="fa fa-calendar"/></div>
          <div><i class="fa fa-calendar"/></div>
          <DayPicker
            onDayClick={ this.handleStartDay }
            selectedDays={ this.isStartDaySelected }
          />
          <DayPicker
            onDayClick={ this.handleEndDay }
            selectedDays={this.isEndDaySelected}
          />
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
