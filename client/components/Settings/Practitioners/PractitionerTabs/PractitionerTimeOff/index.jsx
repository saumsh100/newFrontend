import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { createEntityRequest, deleteEntityRequest, updateEntityRequest } from '../../../../../thunks/fetchEntities';
import { IconButton, Modal } from '../../../../library';
import TimeOffList from './TimeOffList';
import CreateTimeOffForm from './CreateTimeOffForm';

class PractitionerTimeOff extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      timeOff: null,
      formState: '',
    }
    this.setActive = this.setActive.bind(this);
    this.setFormState = this.setFormState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteTimeOff = this.deleteTimeOff.bind(this);
  }


  handleSubmit(values) {
    const { practitioner, createEntityRequest, updateEntityRequest } = this.props;
    const { timeOff } = this.state;

    const trimValues = {
      practitionerId: practitioner.get('id'),
      startDate: values.startDate,
      endDate: values.endDate,
      allDay: values.allDay,
    };

    if (this.state.formState === 'create') {
      createEntityRequest({ key: 'timeOffs', entityData: trimValues });

    } else {
      const valuesMap = Map(trimValues);
      const modifiedAccount = timeOff.merge(valuesMap);
      updateEntityRequest({ key: 'timeOff', model: modifiedAccount });
    }
    this.setActive();
  }

  deleteTimeOff() {
    const { timeOff } = this.state;
    this.props.deleteEntityRequest({ key: 'timeOffs', id: timeOff.get('id') });
    this.setActive();
  }

  setFormState(formState, timeOff) {
    this.setState({
      active: true,
      timeOff,
      formState,
    });
  }

  setActive() {
    this.setState({ active: !this.state.active });
  }

  render() {

    const { timeOffs, practitioner } = this.props;
    const { timeOff } = this.state;

    if (!timeOffs) {
      return null;
    }

    let key =`${practitioner.get('id')}_createTimeOff`;
    if (timeOff) {
      key = `${timeOff.get('id')}_editTimeOff`;
    }

    return (
      <div>
        Add Time Off
        <IconButton
          icon="plus"
          onClick={() => this.setFormState('create', null)}
        />
        <Modal
          active={this.state.active}
          onEscKeyDown={this.setActive}
          onOverlayClick={this.setActive}
        >
          <CreateTimeOffForm
            key={key}
            formName={key}
            timeOff={this.state.timeOff}
            handleSubmit={this.handleSubmit}
            deleteTimeOff={this.deleteTimeOff}
          />
        </Modal>
        <TimeOffList
          key={`${practitioner.get('id')}_timeOffList`}
          timeOffs={timeOffs}
          practitioner={practitioner}
          deleteEntityRequest={this.props.deleteEntityRequest}
          setFormState={this.setFormState}
        />
      </div>
    );
  }

}

PractitionerTimeOff.PropTypes = {
  timeOffs: PropTypes.prop,
  createEntityRequest: PropTypes.func,
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
