
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import moment from 'moment';
import {
  createEntityRequest,
  deleteEntityRequest,
  updateEntityRequest,
} from '../../../../../thunks/fetchEntities';
import { IconButton, Modal } from '../../../../library';
import TimeOffList from './TimeOffList';
import TimeOffForm from './TimeOffForm';

const mergeTime = (date, time, allDay) => {
  return allDay ? date : new Date(date.setHours(time.getHours()));
}

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
    const {
      practitioner,
      createEntityRequest,
      updateEntityRequest,
    } = this.props;

    const { selectedTimeOff } = this.state;

    const {
      startDate,
      endDate,
      startTime,
      endTime,
      allDay,
    } = values;

    // TODO: is !allDay merge in startTime, endTime into startDate endDate
    const mergedStartDate = mergeTime(new Date(startDate), new Date(startTime), allDay);
    const mergedEndDate = mergeTime(new Date(endDate), new Date(endTime), allDay);

    const trimValues = {
      practitionerId: practitioner.get('id'),
      startDate: mergedStartDate,
      endDate: mergedEndDate,
      allDay: values.allDay,
      note: values.note,
    };

    if (this.state.isAdding) {
      createEntityRequest({ key: 'timeOffs', entityData: trimValues });
    } else if (selectedTimeOff) {
      // We assume selected practitioner is
      const valuesMap = Map(trimValues);
      const modifiedAccount = selectedTimeOff.merge(valuesMap);
      updateEntityRequest({ key: 'timeOffs', model: modifiedAccount });
    } else {
      throw new Error('Form was submitted without added or selected time off');
    }

    this.reinitializeState();
  }

  deleteTimeOff(timeOff) {
    this.props.deleteEntityRequest({ key: 'timeOffs', id: timeOff.get('id') });
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
    const {
      timeOffs,
      practitioner,
    } = this.props;

    const {
      isAdding,
      selectedTimeOff,
    } = this.state;

    // TODO: what about if no practitioner? its same ajax request
    if (!timeOffs) {
      return null;
    }


    const formTimeOff = selectedTimeOff || Map({
      startDate: moment().format('L'),
      endDate: moment().format('L'),
      allDay: true,
      note: '',
    });

    let formName = `practitioner${practitioner.get('id')}_timeOff`;
    if(selectedTimeOff) {
      formName = `timeOff${selectedTimeOff.get('id')}_timeOff`;
    }


    return (
      <div>
        Add Time Off
        <IconButton
          icon="plus"
          onClick={this.addTimeOff}
        />
        <Modal
          active={isAdding || !!selectedTimeOff}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          <TimeOffForm
            key={formName}
            formName={formName}
            timeOff={formTimeOff}
            handleSubmit={this.handleSubmit}
          />
        </Modal>
        <TimeOffList
          timeOffs={timeOffs}
          practitioner={practitioner}
          onSelectTimeOff={this.selectTimeOff}
          deleteTimeOff={this.deleteTimeOff}
        />
      </div>
    );
  }

}

PractitionerTimeOff.propTypes = {
  timeOffs: PropTypes.arrayOf(PropTypes.object),
  practitioner: PropTypes.object,
  createEntityRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    createEntityRequest,
    deleteEntityRequest,
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(PractitionerTimeOff);
