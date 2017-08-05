
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
import { IconButton, Modal, Button, DialogBox } from '../../../../library';
import RemoteSubmitButton from '../../../../library/Form/RemoteSubmitButton';
import RecurringTimeOffListItem from './RecurringTimeOffListItem';
import RecurringTimeOffList from './RecurringTimeOffList';
import RecurringTimeOffForm from './RecurringTimeOffForm';
import styles from './styles.scss';

class PractitionerRecurringTimeOff extends Component {
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
      dayOfWeek,
      endTime,
      interval,
      allDay,
      note,
    } = values;

    const trimValues = {
      practitionerId: practitioner.get('id'),
      startDate,
      endDate,
      startTime,
      dayOfWeek,
      endTime,
      interval,
      allDay,
      note,
    };

    if (this.state.isAdding) {
      const alert = {
        success: {
          body: `${practitioner.get('firstName')} added a time off.`,
        },
        error: {
          body: `${practitioner.get('firstName')} time off could not be added`,
        },
      };

      createEntityRequest({ key: 'practitionerRecurringTimeOffs', entityData: trimValues, alert });
    } else if (selectedTimeOff) {
      // We assume selected practitioner is
      const alert = {
        success: {
          body: `${practitioner.get('firstName')} updated a time off.`,
        },
        error: {
          body: `${practitioner.get('firstName')} time off could not be updated`,
        },
      };

      const valuesMap = Map(trimValues);
      const modifiedAccount = selectedTimeOff.merge(valuesMap);
      updateEntityRequest({ key: 'practitionerRecurringTimeOffs', model: modifiedAccount, alert });
    } else {
      throw new Error('Form was submitted without added or selected time off');
    }

    this.reinitializeState();
  }

  deleteTimeOff(timeOff) {
    this.props.deleteEntityRequest({ key: 'practitionerRecurringTimeOffs', id: timeOff.get('id') });
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
      recurringTimeOffs,
      practitioner,
    } = this.props;

    const {
      isAdding,
      selectedTimeOff,
    } = this.state;

    let formName = `practitioner${practitioner.get('id')}_recurringTimeOff`;
    if (selectedTimeOff) {
      formName = `timeOff${selectedTimeOff.get('id')}_recurringTimeOff`;
    }

    let showAddOrListComponent = (
      <div style={{ paddingLeft: '10px', paddingTop: '20px' }}>
        <Button onClick={this.addTimeOff} >Add Time Off</Button>
      </div>
    );
    if (recurringTimeOffs.size > 0) {
      showAddOrListComponent = (
        <RecurringTimeOffList
          recurringTimeOffs={recurringTimeOffs}
          practitioner={practitioner}
          onSelectTimeOff={this.selectTimeOff}
          deleteTimeOff={this.deleteTimeOff}
        >
          <IconButton
            icon="plus"
            onClick={this.addTimeOff}
          />
        </RecurringTimeOffList>
      );
    }

    const formTimeOff = selectedTimeOff || Map({
      startDate: moment().format('L'),
      endDate: moment().format('L'),
      allDay: true,
      note: '',
    });

    if (!recurringTimeOffs || !practitioner) {
      return null;
    }

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Save', onClick: this.handleSubmit, component: RemoteSubmitButton, props: { form: formName } },
    ];

    return (
      <div>
        {showAddOrListComponent}
        <DialogBox
          key={'addTimeOff'}
          actions={actions}
          title="Add Time Off"
          type="medium"
          active={isAdding || !!selectedTimeOff}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
          className={styles.modal}
          custom
        >
          <RecurringTimeOffForm
            key={formName}
            formName={formName}
            timeOff={formTimeOff}
            handleSubmit={this.handleSubmit}
          />
        </DialogBox>
      </div>
    );
  }

}

PractitionerRecurringTimeOff.propTypes = {
  recurringTimeOffs: PropTypes.object,
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

export default enhance(PractitionerRecurringTimeOff);
