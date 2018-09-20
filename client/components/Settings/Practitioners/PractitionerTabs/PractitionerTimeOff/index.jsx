
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import moment from 'moment';
import {
  createEntityRequest,
  deleteEntityRequest,
  updateEntityRequest,
} from '../../../../../thunks/fetchEntities';
import { IconButton, Button, DialogBox } from '../../../../library';
import RemoteSubmitButton from '../../../../library/Form/RemoteSubmitButton';
import TimeOffList from './TimeOffList';
import TimeOffForm from './TimeOffForm';

const mergeTime = (date, time, allDay, timezone) => {
  date = moment(date);
  time = moment.tz(time, timezone);
  time.year(date.year());
  time.month(date.month());
  time.date(date.date());
  return allDay ? date.format() : time.format();
};

class PractitionerTimeOff extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      selectedTimeOff: null,
      values: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteTimeOff = this.deleteTimeOff.bind(this);
    this.addTimeOff = this.addTimeOff.bind(this);
    this.selectTimeOff = this.selectTimeOff.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
  }

  handleSubmit(values) {
    const { practitioner, createEntityRequest, updateEntityRequest, timezone } = this.props;

    const { selectedTimeOff } = this.state;

    const { startDate, endDate, startTime, endTime, allDay } = values;

    // TODO: is !allDay merge in startTime, endTime into startDate endDate
    const mergedStartDate = mergeTime(startDate, startTime, allDay, timezone);

    const mergedEndDate = mergeTime(endDate, endTime, allDay, timezone);

    const trimValues = {
      practitionerId: practitioner.get('id'),
      startDate: mergedStartDate,
      endDate: mergedEndDate,
      allDay: values.allDay,
      note: values.note,
    };

    if (this.state.isAdding) {
      const alert = {
        success: { body: `${practitioner.get('firstName')} added a time off.` },
        error: { body: `${practitioner.get('firstName')} time off could not be added` },
      };

      createEntityRequest({
        key: 'practitionerRecurringTimeOffs',
        entityData: trimValues,
        alert,
      });
    } else if (selectedTimeOff) {
      // We assume selected practitioner is
      const alert = {
        success: { body: `${practitioner.get('firstName')} updated a time off.` },
        error: { body: `${practitioner.get('firstName')} time off could not be updated` },
      };

      const valuesMap = Map(trimValues);
      const modifiedAccount = selectedTimeOff.merge(valuesMap);
      updateEntityRequest({
        key: 'practitionerRecurringTimeOffs',
        model: modifiedAccount,
        alert,
      });
    } else {
      throw new Error('Form was submitted without added or selected time off');
    }

    this.reinitializeState();
  }

  deleteTimeOff(timeOff) {
    this.props.deleteEntityRequest({
      key: 'practitionerRecurringTimeOffs',
      id: timeOff.get('id'),
    });
  }

  reinitializeState() {
    this.setState({
      isAdding: false,
      selectedTimeOff: null,
    });
  }

  addTimeOff() {
    this.setState({
      isAdding: true,
      selectedTimeOff: null,
    });
  }

  selectTimeOff(timeOff) {
    this.setState({
      isAdding: false,
      selectedTimeOff: timeOff,
    });
  }

  render() {
    const { timeOffs, practitioner, timezone } = this.props;

    const { isAdding, selectedTimeOff } = this.state;

    if (!timeOffs && !practitioner) {
      return null;
    }

    const formTimeOff =
      selectedTimeOff ||
      Map({
        startDate: moment()
          .tz(timezone)
          .format('L'),
        endDate: moment()
          .tz(timezone)
          .format('L'),
        allDay: true,
        note: '',
      });

    let formName = `practitioner${practitioner.get('id')}_timeOff`;
    if (selectedTimeOff) {
      formName = `timeOff${selectedTimeOff.get('id')}_timeOff`;
    }

    let showAddOrListComponent = (
      <div
        style={{
          paddingLeft: '10px',
          paddingTop: '20px',
        }}
      >
        <Button onClick={this.addTimeOff} secondary data-test-id="addTimeOffButton" create>
          Add Time Off
        </Button>
      </div>
    );

    if (timeOffs.size > 0) {
      showAddOrListComponent = (
        <TimeOffList
          timeOffs={timeOffs}
          practitioner={practitioner}
          onSelectTimeOff={this.selectTimeOff}
          deleteTimeOff={this.deleteTimeOff}
          timezone={timezone}
        >
          <IconButton icon="plus" onClick={this.addTimeOff} />
        </TimeOffList>
      );
    }

    const actions = [
      {
        label: 'Cancel',
        onClick: this.reinitializeState,
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        onClick: this.handleSubmit,
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: formName,
        },
      },
    ];

    return (
      <div>
        {showAddOrListComponent}
        <DialogBox
          key="addTimeOff"
          actions={actions}
          title="Add Time Off"
          type="medium"
          active={isAdding || !!selectedTimeOff}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
          data-test-id="addTimeOffDialog"
        >
          <TimeOffForm
            key={formName}
            formName={formName}
            timeOff={formTimeOff}
            handleSubmit={this.handleSubmit}
            timezone={timezone}
          />
        </DialogBox>
      </div>
    );
  }
}

PractitionerTimeOff.propTypes = {
  timeOffs: PropTypes.object,
  practitioner: PropTypes.object,
  createEntityRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

function mapStateToProps({ auth }) {
  return { timezone: auth.get('timezone') };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      createEntityRequest,
      deleteEntityRequest,
      updateEntityRequest,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapActionsToProps,
);

export default enhance(PractitionerTimeOff);
