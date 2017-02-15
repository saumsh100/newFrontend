
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

import {
  sixDaysShift,
  setDay,
} from  '../thunks/availabilities';

class Availability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(4, 'd')._d,
      shouldFetchAvailabilities: true,
      modalIsOpen: false,
      retrieveFirstTime: true,
      practitonersStartEndDate: {},
    };
    this.onDoctorChange = this.onDoctorChange.bind(this);
    this.onServiceChange = this.onServiceChange.bind(this);
    this.sixDaysBack = this.sixDaysBack.bind(this);
    this.sixDaysForward = this.sixDaysForward.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.isDaySelected = this.isDaySelected.bind(this)
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
        };
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
        .filter(a => (a.practitionerId == this.state.practitionerId));


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
        params: {
        practitionerId: this.state.practitionerId
      },
      });
    })
  }

  onServiceChange(e) {
    this.setState({
      serviceId: e.target.value,
      retrieveFirstTime: false,
    }, () => {
      // this.props.preventEntityDuplication({ key: 'availabilities' });
      this.props.fetchEntities({ key: 'availabilities',
        params: {
          serviceId: this.state.serviceId,
          practitionerId: this.state.practitionerId,
          startDate: this.state.selectedStartDay,
          endDate: this.state.selectedEndDay,
        },
      });
    });
  }

  sixDaysBack() {
    const { sixDaysShift } = this.props;
    const { practitonersStartEndDate } = this.state;



    const selectedOldStartDay = practitonersStartEndDate[this.state.practitionerId].selectedStartDay;
    const newEndDay = moment(selectedOldStartDay)._d
    const newStartDay = moment(newEndDay).subtract(4, 'd')._d;
    practitonersStartEndDate[this.state.practitionerId].selectedStartDay = newStartDay;
    practitonersStartEndDate[this.state.practitionerId].selectedEndDay = newEndDay;

    sixDaysShift({
      selectedStartDay: newStartDay,
      selectedEndDay: newEndDay,
      practitionerId: this.state.practitionerId,
    });

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
    const { sixDaysShift } = this.props;

    const { practitonersStartEndDate } = this.state;

    const selectedOldStartDay = practitonersStartEndDate[this.state.practitionerId].selectedStartDay;
    const newStartDay = moment(selectedOldStartDay).add(4, 'd')._d;
    const newEndDay = moment(newStartDay).add(4, 'd')._d;
    practitonersStartEndDate[this.state.practitionerId].selectedStartDay = newStartDay;
    practitonersStartEndDate[this.state.practitionerId].selectedEndDay = newEndDay;

    sixDaysShift({
      selectedStartDay: newStartDay,
      selectedEndDay: newEndDay,
      practitionerId: this.state.practitionerId,
    });

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
    const { sixDaysShift } = this.props;

    const selectedOldStartDay = practitonersStartEndDate[this.state.practitionerId].selectedStartDay;
    const newStartDay = day;
    const newEndDay = moment(newStartDay).add(4, 'd')._d;
    practitonersStartEndDate[this.state.practitionerId].selectedStartDay = newStartDay;
    practitonersStartEndDate[this.state.practitionerId].selectedEndDay = newEndDay;
    console.log(day, 'the DAY');
    sixDaysShift({
      selectedStartDay: newStartDay,
      selectedEndDay: newEndDay,
      practitionerId: this.state.practitionerId,      
    });
    
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

    const sortedByDate = this.props.availabilities.get('models')
      .toArray()
      .filter(a => a.practitionerId === this.state.practitionerId)
      .sort((a, b) => {
        if (moment(a.date) > moment(b.date)) return 1;
        if (moment(a.date) < moment(b.date)) return -1;
        return 0;
      });


    let selectedStartDay = this.state.selectedStartDay;
    let selectedEndDay = this.state.selectedEndDay;

    const practitonersStartEndDate = this.state.practitonersStartEndDate;

    if (!practitonersStartEndDate[this.state.practitionerId] && sortedByDate && sortedByDate.length) {

      selectedStartDay = sortedByDate[0].date;
      selectedEndDay = moment(selectedStartDay).add(4, 'days')._d;
      practitonersStartEndDate[this.state.practitionerId] = {
        selectedStartDay: sortedByDate[0].date,
        selectedEndDay:  moment(selectedStartDay).add(4, 'days')._d,
      };
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

    console.log("selectedStartDay");
    console.log(selectedStartDay);
    console.log("selectedEndDay");
    console.log(selectedEndDay);



    console.log(moment(this.state.selectedEndDay).format('MMMM Do YYYY, h:mm:ss a'));
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

function mapStateToProps({ entities, availabilities }) {
  return {
    availabilities: entities.get('availabilities'),
    services: entities.get('services'),
    practitioners: entities.get('practitioners'),
    practitonersStartEndDate: availabilities,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    sixDaysShift,
    setDay,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Availability);
