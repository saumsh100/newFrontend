
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

class PractitionerTimeOff extends Component {
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
      createEntityRequest,
      updateEntityRequest,
    } = this.props;

    const { timeOff } = this.state;

    const {
      startDate,
      endDate,
      startTime,
      endTime,
      allDay,
    } = values;

    // TODO: is !allDay merge in startTime, endTime into startDate endDate
    const mergedStartDate = startDate;
    const mergedEndDate = endDate;

    const trimValues = {
      practitionerId: practitioner.get('id'),
      startDate: mergedStartDate,
      endDate: mergedEndDate,
      allDay: values.allDay,
    };

    if (this.state.isAdding) {
      createEntityRequest({ key: 'timeOffs', entityData: trimValues });
    } else if (this.state.selectedTimeOff) {
      // We assume selected practitioner is
      const valuesMap = Map(trimValues);
      const modifiedAccount = timeOff.merge(valuesMap);
      updateEntityRequest({ key: 'timeOff', model: modifiedAccount });
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
      startDate: moment().toISOString(),
      endDate: moment().toISOString(),
      allDay: true,
    });

    const formName = `practitioner${practitioner.get('id')}_timeOff`;

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
            formName={formName}
            timeOff={formTimeOff}
            handleSubmit={this.handleSubmit}
          />
        </Modal>
        <TimeOffList
          timeOffs={timeOffs}
          practitioner={practitioner}
          onSelectTimeOff={this.selectTimeOff}
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
