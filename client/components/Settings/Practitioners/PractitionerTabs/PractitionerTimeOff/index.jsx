import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { fetchEntities, createEntityRequest, deleteEntityRequest } from '../../../../../thunks/fetchEntities';
import { IconButton, Modal } from '../../../../library';
import TimeOffList from './TimeOffList';
import CreateTimeOffForm from './CreateTimeOffForm';

class PractitionerTimeOff extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
    this.setActive = this.setActive.bind(this)
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'practitioners', join: ['timeOffs'] });
  }

  setActive() {
    this.setState({ active: !this.state.active });
  }

  render() {
    const { timeOffs, practitioner } = this.props;

    if (!timeOffs) {
      return null;
    }

    return (
      <div>
        Add Time Off
        <IconButton
          icon="plus"
          onClick={this.setActive}
        />
        <Modal
          active={this.state.active}
          onEscKeyDown={this.setActive}
          onOverlayClick={this.setActive}
        >
          <CreateTimeOffForm
            key={`${practitioner.get('id')}_createTimeOff`}
            practitioner={practitioner}
            setActive={this.setActive}
            createEntityRequest={this.props.createEntityRequest}
          />
        </Modal>
        <TimeOffList
          key={`${practitioner.get('id')}_timeOffList`}
          timeOffs={timeOffs}
          deleteTimeOff={this.props.deleteEntityRequest}
        />
      </div>
    );
  }

}

PractitionerTimeOff.PropTypes = {
  fetchEntities: PropTypes.func,
  timeOffs: PropTypes.prop,
  createEntityRequest: PropTypes.func,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    deleteEntityRequest,
  }, dispatch);
}

function mapStateToProps({ entities }, { practitioner }) {
  const timeOffs = entities.getIn(['timeOffs', 'models']).filter((timeOff) => {
    return timeOff.practitionerId === practitioner.get('id');
  });

  return {
    timeOffs,
  };
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(PractitionerTimeOff);
