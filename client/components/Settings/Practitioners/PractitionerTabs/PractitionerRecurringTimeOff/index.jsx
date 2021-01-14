
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import {
  createEntityRequest,
  deleteEntityRequest,
  updateEntityRequest,
} from '../../../../../thunks/fetchEntities';
import {
  IconButton,
  Button,
  DialogBox,
  getTodaysDate,
  parseDateWithFormat,
} from '../../../../library';
import RemoteSubmitButton from '../../../../library/Form/RemoteSubmitButton';
import RecurringTimeOffList from './RecurringTimeOffList';
import RecurringTimeOffForm from './RecurringTimeOffForm';
import { practitionerShape } from '../../../../library/PropTypeShapes';

function setDate(date, timezone) {
  const newTime = parseDateWithFormat(date, 'YYYY-MM-DDThh:mm:ssZ', timezone).set({
    hours: 0,
    minutes: 0,
  });

  if (!newTime.isValid()) {
    return parseDateWithFormat(date, 'L', timezone).format();
  }

  return newTime.format();
}

class PractitionerRecurringTimeOff extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      selectedTimeOff: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteTimeOff = this.deleteTimeOff.bind(this);
    this.addTimeOff = this.addTimeOff.bind(this);
    this.selectTimeOff = this.selectTimeOff.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
  }

  handleSubmit(values) {
    const {
      practitioner,
      createEntityRequest: createEntityRequestLocal,
      updateEntityRequest: updateEntityRequestLocal,
      timezone,
    } = this.props;

    const { selectedTimeOff } = this.state;

    const { startDate, endDate, startTime, dayOfWeek, endTime, interval, allDay, note } = values;

    const trimValues = {
      practitionerId: practitioner.get('id'),
      startDate: setDate(startDate, timezone),
      endDate: setDate(endDate, timezone),
      startTime,
      dayOfWeek,
      endTime,
      interval,
      allDay,
      note,
    };

    if (this.state.isAdding) {
      const alert = {
        success: { body: `${practitioner.get('firstName')} added a time off.` },
        error: { body: `${practitioner.get('firstName')} time off could not be added` },
      };

      createEntityRequestLocal({
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
      updateEntityRequestLocal({
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
    const { recurringTimeOffs, practitioner, timezone } = this.props;

    const { isAdding, selectedTimeOff } = this.state;

    let formName = `practitioner${practitioner.get('id')}_recurringTimeOff`;
    if (selectedTimeOff) {
      formName = `timeOff${selectedTimeOff.get('id')}_recurringTimeOff`;
    }

    let showAddOrListComponent = (
      <div
        style={{
          paddingLeft: '10px',
          paddingTop: '20px',
        }}
      >
        <Button onClick={this.addTimeOff} secondary data-test-id="addRecurringTimeOffButton">
          Add Recurring Time Off
        </Button>
      </div>
    );
    if (recurringTimeOffs.size > 0) {
      showAddOrListComponent = (
        <RecurringTimeOffList
          recurringTimeOffs={recurringTimeOffs}
          practitioner={practitioner}
          onSelectTimeOff={this.selectTimeOff}
          deleteTimeOff={this.deleteTimeOff}
          timezone={timezone}
        >
          <IconButton icon="plus" onClick={this.addTimeOff} />
        </RecurringTimeOffList>
      );
    }

    const formTimeOff = selectedTimeOff
      || Map({
        startDate: getTodaysDate(timezone, true).format('L'),
        endDate: getTodaysDate(timezone, true).format('L'),
        allDay: true,
        note: '',
      });

    if (!recurringTimeOffs || !practitioner) {
      return null;
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
        >
          <RecurringTimeOffForm
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

PractitionerRecurringTimeOff.propTypes = {
  recurringTimeOffs: PropTypes.instanceOf(Map),
  practitioner: PropTypes.shape(practitionerShape),
  createEntityRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

PractitionerRecurringTimeOff.defaultProps = {
  recurringTimeOffs: null,
  practitioner: null,
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

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(PractitionerRecurringTimeOff);
