import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import OfficeHoursForm from '../../Schedule/OfficeHours/OfficeHoursForm';
import BreaksForm from '../../Schedule/OfficeHours/BreaksForm';
import { Toggle } from '../../../library';
import { createEntityRequest, } from '../../../../thunks/fetchEntities';

class PractitionerOfficeHours extends Component{

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    }
    this.handleToggle = this.handleToggle.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);
  }

  componentWillMount() {
    const { practitioner } = this.props;
    let customScheduleValue = practitioner ? practitioner.get('isCustomSchedule') : null
    let value = customScheduleValue ? 'on' : 'off';
    this.setState({ value });
  }

  handleToggle(e) {
    e.stopPropagation();
    const { practitioner } = this.props;
    const { value } = this.state;

    const modifiedPractitioner = ((value === 'off') ?
      practitioner.set('isCustomSchedule', true) : practitioner.set('isCustomSchedule', false));

    this.props.updateEntityRequest({ key: 'practitioners', model: modifiedPractitioner });

    const newValue = (value === 'off') ? 'on' : 'off';
    this.setState({ value: newValue });
  }

  handleFormUpdate(values) {
    const { weeklySchedule, } = this.props;
    const newWeeklySchedule = weeklySchedule.merge(values);
    this.props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule });
  }

  render() {
    const { weeklySchedule, practitioner } = this.props;

    let showComponent = null;

    if (weeklySchedule) {
      showComponent = (
        <div>
          <OfficeHoursForm
            weeklySchedule={weeklySchedule}
            onSubmit={this.handleFormUpdate}
            formName={`${weeklySchedule.get('id')}officeHours`}
          />
          <BreaksForm
            weeklySchedule={weeklySchedule}
            onSubmit={this.handleFormUpdate}
            formName={`${weeklySchedule.get('id')}officeHours`}
            breaksName={`${weeklySchedule.get('id')}clinicBreaks`}
          />
        </div>
      );

    } else if (!practitioner.get('isCustomSchedule')) {
      showComponent = (
        <div>
          Currently, { practitioner.getFullName() } is inheriting the same weekly
          schedule as the clinic's office hours,
          to make it custom, click the toggle above.
        </div>
      );
    }
    return (
      <div>
        <div>
          <Toggle
            defaultChecked={practitioner.get('isCustomSchedule')}
            icons={false}
            value={this.state.value}
            onChange={this.handleToggle}
          />
        </div>
        {showComponent}
      </div>
    );
  }
}

export default PractitionerOfficeHours;