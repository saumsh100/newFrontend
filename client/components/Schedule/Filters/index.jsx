import React, { Component, PropTypes } from 'react';
import {
  Icon, Card
} from '../../library';
import styles from './styles.scss';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.handleTypeFilter = this.handleTypeFilter.bind(this);
    this.handleCheckDoctor = this.handleCheckDoctor.bind(this);
    this.clearAllSelectors = this.clearAllSelectors.bind(this);
  }

  handleCheckDoctor(practitionerId, checked) {
    if (checked) {
      this.props.removePractitionerFromFilter(practitionerId);
    } else {
      this.props.addPractitionerToFilter(practitionerId);
    }
  }
  handleTypeFilter(type) {
    this.props.selectAppointmentType(type.target.value);
  }
  clearAllSelectors() {
    this.props.selectAppointmentType("all");
    this.refs.select.value = "all";
  }

  render() {
    const { practitioners, schedule, appointmentsTypes } = this.props;
    const filterPractitioners = schedule.toJS().practitioners;
    return (
      <Card className={styles.schedule_filter}>
        <div className={styles.filter_header}>
          <div className={styles.filter_header__title}>
            Filter
          </div>
          <div className={styles.filter_header__icon}>
            <Icon icon="sliders" />
          </div>
          <div onClick={this.clearAllSelectors} className={styles.filter_header__link}>Clear All</div>
        </div>
        <div className={styles.filter_practitioner}>
          <div className={styles.filter_practitioner__title}>
            Practitioners
          </div>
          <ul className={styles.filter_practitioner__wrapper}>
            {practitioners.map((pr, i) => {
              const checked = filterPractitioners.indexOf(pr.id) > -1;
              return (
                <div key={pr.id} className={styles.filter_practitioner__list}>
                  <input className={styles.filter_practitioner__checkbox}
                    type="checkbox" checked={checked} id={`checkbox-${i}`}
                    onChange={() => {this.handleCheckDoctor(pr.id, checked);
                  }} />
                  <label className={styles.filter_practitioner__label} htmlFor={`checkbox-${i}`}>
                    <li className={styles.filter_practitioner__item}>
                      <img className={styles.filter_practitioner__photo} src="https://randomuser.me/api/portraits/men/44.jpg" alt="practitioner" />
                      <div className={styles.filter_practitioner__name}>{pr.firstName}</div>
                      <div className={styles.filter_practitioner__spec}>Dentist</div>
                    </li>
                  </label>
                </div>
              );
            })}
          </ul>
          <div className={styles.filter_options}>
            <div className={styles.filter_options__item}>
              <div className={styles.filter_options__title}>Services:</div>
              <select ref="select" onChange={this.handleTypeFilter}>
                <option  value="all">All</option>
                {appointmentsTypes.map((app, i) => (
                  <option key={i} value={app}>{app}</option>
                ))}
              </select>
            </div>
            <div className={styles.filter_options__item}>
              <div className={styles.filter_options__title}>Chairs:</div>
              <select disabled="disabled">
                <option value="all">All</option>
              </select>
            </div>
            <div className={styles.filter_options__item}>
              <div className={styles.filter_options__title}>Reminders:</div>
              <select disabled="disabled">
                <option value="all">All</option>
              </select>
            </div>
            <div className={styles.filter_options__item}>
              <div className={styles.filter_options__title}>Insurance:</div>
              <select disabled="disabled">
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

Filters.PropTypes = {
  addPractitionerToFilter: PropTypes.func,
  selectAppointmentType: PropTypes.func,
  removePractitionerFromFilter: PropTypes.func
};

export default Filters;
