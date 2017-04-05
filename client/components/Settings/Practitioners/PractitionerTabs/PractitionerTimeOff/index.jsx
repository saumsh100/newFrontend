import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { fetchEntities } from '../../../../../thunks/fetchEntities';
import { IconButton, Modal } from '../../../../library';
import TimeOffList from './TimeOffList'
import CreateTimeOff from './CreateTimeOff';

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
    const active = (this.state.active !== true);
    this.setState({ active });
  }

  render() {
    const { timeOffs } = this.props;

    if (!timeOffs) {
      return null;
    }

    return (
      <div>
        <IconButton
          icon="plus"
          onClick={this.setActive}
        />
        <Modal
          active={this.state.active}
          onEscKeyDown={this.setActive}
          onOverlayClick={this.setActive}
        >
          <CreateTimeOff />
        </Modal>
        <TimeOffList
          timeOffs={timeOffs}
        />
      </div>
    );
  }

}

PractitionerTimeOff.PropTypes = {
  fetchEntities: PropTypes.func,
  timeOffs: PropTypes.prop,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
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
