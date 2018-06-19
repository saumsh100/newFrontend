
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment/moment';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import WaitlistSchedule from '../Schedule/Header/Waitlist';
import { fetchWaitSpots, deleteMultipleWaitSpots } from '../../thunks/waitlist';
import SelectedCounter from './SelectedCounter';
import ExtraOptionsHubMenu from '../ExtraOptionsHubMenu';

class Waitlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedElements: [],
    };

    this.selectWaitSpot = this.selectWaitSpot.bind(this);
    this.deleteSelectedElements = this.deleteSelectedElements.bind(this);
    this.clearSelectedList = this.clearSelectedList.bind(this);
  }

  componentDidMount() {
    this.props.fetchWaitSpots(['patientUser', 'patient'], {
      startTime: moment().toISOString(),
      endTime: moment()
        .add(360, 'days')
        .toISOString(),
    });
  }

  getMenuOptions() {
    if (this.state.selectedElements.length > 0) {
      return [
        {
          icon: 'trash',
          text: 'DELETE',
          onClick: this.deleteSelectedElements,
        },
        {
          icon: 'ban',
          text: 'CANCEL',
          onClick: this.clearSelectedList,
        },
      ];
    }

    return [
      {
        icon: 'plus',
        text: 'ADD',
        onClick: () => console.log(),
      },
      {
        icon: 'rocket',
        text: 'RUN WAITLIST',
        onClick: () => console.log(),
      },
    ];
  }

  deleteSelectedElements() {
    this.props.deleteMultipleWaitSpots(this.state.selectedElements);
    this.clearSelectedList();
  }

  clearSelectedList() {
    this.setState({
      selectedElements: [],
    });
  }

  selectWaitSpot(id) {
    const elementsList = this.state.selectedElements;
    const indexInSelected = elementsList.indexOf(id);

    if (indexInSelected > -1) {
      elementsList.splice(indexInSelected, 1);
    } else {
      elementsList.push(id);
    }

    this.setState({
      selectedElements: elementsList,
    });
  }

  render() {
    const { patients, patientUsers, waitSpots } = this.props;

    return (
      <div>
        <ExtraOptionsHubMenu options={this.getMenuOptions()}>
          <WaitlistSchedule
            patients={patients}
            patientUsers={patientUsers}
            waitSpots={waitSpots}
            selectWaitSpot={this.selectWaitSpot}
            selectedWaitSpots={this.state.selectedElements}
          />
        </ExtraOptionsHubMenu>
        <SelectedCounter selected={this.state.selectedElements} />
      </div>
    );
  }
}

Waitlist.propTypes = {
  fetchWaitSpots: PropTypes.func.isRequired,
  deleteMultipleWaitSpots: PropTypes.func.isRequired,
  waitSpots: PropTypes.instanceOf(Map).isRequired,
  patients: PropTypes.instanceOf(Map).isRequired,
  patientUsers: PropTypes.instanceOf(Map).isRequired,
};

const mapStateToProps = ({ entities }) => {
  const waitSpots = entities.getIn(['waitSpots', 'models']);
  const patientUsers = entities.getIn(['patientUsers', 'models']);
  const patients = entities.getIn(['patients', 'models']);

  return {
    waitSpots,
    patients,
    patientUsers,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchWaitSpots,
      deleteMultipleWaitSpots,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Waitlist);
