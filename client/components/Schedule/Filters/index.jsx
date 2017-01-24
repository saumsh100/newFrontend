import React, { Component, PropTypes } from 'react';
import { Card } from '../../library';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.handleTypeFilter = this.handleTypeFilter.bind(this);
    this.handleCheckDoctor = this.handleCheckDoctor.bind(this);
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

  render() {
    const { practitioners, schedule, appointmentsTypes } = this.props;
    const filterPractitioners = schedule.toJS().practitioners;
    return (
      <Card style={{ minHeight: '480px' }}>
        <div>
          Filters:
        </div>
        <div>
          Practitioners:
          {practitioners.map((pr, i) => {
            const checked = filterPractitioners.indexOf(pr.id) > -1;
            return (
              <div>
	              <label htmlFor={`checkbox-${i}`}>{pr.firstName}</label>
	              <input type="checkbox"
	                checked={checked}
	                id={`checkbox-${i}`}
	                onChange={() => { this.handleCheckDoctor(pr.id, checked); }}
	              />
              </div>
            );
          })}
          <div>
            Services:
            <select onChange={this.handleTypeFilter} >
              <option value="all">All</option>
              {appointmentsTypes.map(app => (
                <option value={app}>{app}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>
    );
  }
}

Filters.PropTypes = {
	addPractitionerToFilter: PropTypes.func,
	selectAppointmentType: PropTypes.func,
	removePractitionerFromFilter: PropTypes.func,
};

export default Filters;
