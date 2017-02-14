
import React, { PropTypes } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { fetchEntities } from '../thunks/fetchEntities';
import styles from './AvailabilityContainer.scss';

class Availability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(4, 'd')._d,
      shouldFetchAvailabilities: true,
      modalIsOpen: false,
    };
    this.onDoctorChange = this.onDoctorChange.bind(this);
    this.onServiceChange = this.onServiceChange.bind(this);
    this.sixDaysBack = this.sixDaysBack.bind(this);
    this.sixDaysForward = this.sixDaysForward.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.isDaySelected = this.isDaySelected.bind(this);


    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
      const soonestAvailableDay = availabilities.filter(a =>
        a.availabilities.some(item =>
          item.isBusy === false
        )
      )[0];
      console.log(soonestAvailableDay, 'soonest');
      /*  if (!(moment(soonestAvailableDay.date).isSame(this.state.selectedStartDay, 'd') &&
       moment(soonestAvailableDay.date).isSame(this.state.selectedStartDay, 'year') &&
       moment(soonestAvailableDay.date).isSame(this.state.selectedStartDay, 'month')) &&
       this.state.shouldFetchAvailabilities) {
       this.setState({
       selectedStartDay: moment(soonestAvailableDay.date)._d,
       selectedEndDay: moment(soonestAvailableDay.date).add(4, 'd')._d,
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
       } */
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
      selectedStartDay: moment(this.state.selectedStartDay).subtract(4, 'd')._d,
      selectedEndDay: moment(this.state.selectedEndDay).subtract(4, 'd')._d,
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
      selectedStartDay: moment(this.state.selectedStartDay).add(4, 'd')._d,
      selectedEndDay: moment(this.state.selectedEndDay).add(4, 'd')._d,
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

  handleDayClick(e, day) {
    console.log(day, 'the DAY');
    this.setState({
      selectedStartDay: day,
      selectedEndDay: moment(day).add(4, 'd')._d,
      shouldFetchAvailabilities: false,
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

  isDaySelected(day) {
    return DateUtils.isSameDay(day, this.state.selectedStartDay);
  }

  openModal() {
    console.log('openModal', this.state.modalIsOpen);
    this.setState({modalIsOpen: !this.state.modalIsOpen});
  }
  closeModal() {
    this.setState({modalIsOpen: !modalIsOpen});
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
      .filter(a =>
        moment(a.date).isBetween(this.state.selectedStartDay, this.state.selectedEndDay, 'days', true)
      );

    console.log(filteredByDoctor, 'filteredByDoctor');
    return (
      <div className={styles.appointment}>
        <div className={styles.appointment__wrapper}>
          <div className={styles.appointment__sidebar}>
            {/*<div className={styles.appointment__sidebar_title}>*/}
            {/*Pacific Heart Dental*/}
            {/*</div>*/}
          </div>
          <div className={styles.appointment__main}>
            <div className={styles.appointment__header}>
              <div className={styles.appointment__header_title}>
                BOOK APPOINTMENT
              </div>
            </div>
            <div className={styles.appointment__body}>
              <div className={styles.appointment__body_header}>
                <div className={styles.appointment__select_title}>Practitioner</div>
                <div className={styles.appointment__select_wrapper}>
                  <select
                    className={styles.appointment__select_item}
                    value={this.state.practitionerId}
                    onChange={this.onDoctorChange}
                    ref={(doctor) => { this.doctor = doctor; }}>
                    <option value="" selected>No Preference</option>
                    {this.props.practitioners.get('models').toArray().map(p =>
                      <option value={p.id} key={p.id}>{p.getFullName()}</option>
                    )}
                  </select>
                  <select
                    className={styles.appointment__select_item}
                    onChange={this.onServiceChange}
                    ref={(service) => { this.service = service; }}>
                    <option value="" selected>Service</option>
                    {this.props.services.get('models').toArray().filter(s =>
                      includes(s.practitioners, this.state.practitionerId)
                    ).map(s =>
                      <option value={s.id} key={s.id}>{s.name}</option>
                    )}
                  </select></div>
                <div className={styles.appointment__daypicker}>
                  <div className={styles.appointment__daypicker_title}>Appointment scheduler</div>
                  <div onClick={this.openModal}
                       className={styles.appointment__daypicker_icon}>
                    <div className={styles.appointment__daypicker_date}>
                      {moment(this.state.selectedStartDay).format('DD MM YYYY')}
                    </div>
                    <i className="fa fa-calendar" />
                  </div>
                  {this.state.modalIsOpen ?
                    (
                      <div onClick={this.openModal} className={styles.appointment__daypicker_modal}>
                        <DayPicker
                          className={styles.appointment__daypicker_select}
                          onDayClick={ this.handleDayClick }
                          selectedDays={ this.isDaySelected }/>
                      </div>
                    ) : null
                  }
                </div>
              </div>
              <div className={styles.appointment__table}>
                <button className={styles.appointment__table_btn} onClick={this.sixDaysBack}>
                  <i className="fa fa-arrow-circle-o-left"/>
                </button>
                <div className={styles.appointment__table_elements}>
                  {filteredByDoctor.map(av => {
                    return (
                      <ul className={styles.appointment__list} key={av.date}>
                        <div className={styles.appointment__list_header}>
                          <div className={styles.list__header_day}>
                            {moment(av.date).format('ddd')}
                          </div>
                          <div className={styles.list__header_number}>
                            {moment(av.date).format('DD/MM/YYYY')}
                          </div>
                        </div>
                        {av.availabilities.map(slot =>
                          <li className={`${styles.appointment__list_item} ${slot.isBusy ? styles.appointment__list_active : ''}`}
                              key={slot.startsAt}>
                            {moment(slot.startsAt).format('HH:mm A')}
                          </li>)
                        }
                      </ul>);
                  })}
                </div>
                <button className={styles.appointment__table_btn} onClick={this.sixDaysForward}>
                  <i className="fa fa-arrow-circle-o-right"/>
                </button>
              </div>
              <div className={styles.appointment__footer}>
                <div className={styles.appointment__footer_title}>
                  would you like to be informed if an earlier time becomes available?
                </div>
                <form className={styles.appointment__footer_confirm}>
                  <div className={styles.appointment__footer_select}>
                    <input type="radio" name="answer" id="yes" value="yes"/>
                    <label htmlFor="yes">Yes</label>
                    <input type="radio" name="answer" id="no" value="no"/>
                    <label htmlFor="no">No</label>
                  </div>
                  <input className={styles.appointment__footer_btn} type="submit" value="Continue"/>
                </form>
              </div>
            </div>
          </div>
        </div>
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
