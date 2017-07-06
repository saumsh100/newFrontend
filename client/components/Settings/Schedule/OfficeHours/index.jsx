
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import OfficeHoursForm from './OfficeHoursForm';
import BreaksForm from './BreaksForm';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import { Header, Button, DialogBox, RemoteSubmitButton, Form, Field, } from '../../../library';
import styles from './styles.scss';

class OfficeHours extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };

    this.reinitializeState = this.reinitializeState.bind(this);
    this.openModal = this.openModal.bind(this);
    this.createPattern = this.createPattern.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
    this.delete = this.delete.bind(this);
  }

  reinitializeState() {
    this.setState({
      active: false,
    });
  }

  delete(i) {
    const weeklySchedule = Object.assign({}, this.props.weeklySchedule.toJS());
    weeklySchedule.weeklySchedules.splice(i, 1);

    if (!weeklySchedule.weeklySchedules[0]) {
      weeklySchedule.isAdvanced = false;
    }

    const newWeeklySchedule = this.props.weeklySchedule.merge(weeklySchedule);

    const alert = {
      success: {
        body: 'Clinic Pattern Deleted',
      },
      error: {
        body: 'Clinic Pattern Deleted Failed',
      },
    };

    this.props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule, alert });
  }

  sendEdit(i, values) {
    const weeklySchedule = Object.assign({}, this.props.weeklySchedule.toJS());

    Object.keys(values).forEach((key) => {
      if (values[key].breaks) {
        weeklySchedule.weeklySchedules[i][key].breaks = values[key].breaks;
      } else {
        const breaks = weeklySchedule.weeklySchedules[i][key].breaks;
        weeklySchedule.weeklySchedules[i][key] = values[key];
        weeklySchedule.weeklySchedules[i][key].breaks = breaks;
      }
    });

    const newWeeklySchedule = this.props.weeklySchedule.merge(weeklySchedule);

    const alert = {
      success: {
        body: 'Clinic Office Hours Updated',
      },
      error: {
        body: 'Clinic Office Hours Update Failed',
      },
    };

    this.props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule, alert });
  }

  createPattern(values) {
    const weeklySchedule = Object.assign({}, this.props.weeklySchedule.toJS());
    const weeklyScheduleNew = Object.assign({}, this.props.weeklySchedule.toJS());

    delete weeklyScheduleNew.weeklySchedules;
    delete weeklyScheduleNew.startDate;
    delete weeklyScheduleNew.id;

    weeklySchedule.weeklySchedules.push(weeklyScheduleNew);
    weeklySchedule.startDate = values.startDate;
    weeklySchedule.isAdvanced = true;

    const newWeeklySchedule = this.props.weeklySchedule.merge(weeklySchedule);

    const alert = {
      success: {
        body: 'Clinic Office Hours Updated',
      },
      error: {
        body: 'Clinic Office Hours Update Failed',
      },
    };

    this.props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule, alert })
    .then(() => {
      this.setState({
        active: false,
      });
    });
  }

  openModal() {
    this.setState({
      active: true,
    });
  }

  render() {
    const { weeklySchedule } = this.props;
    const handleSubmit = (values) => {
      const newWeeklySchedule = weeklySchedule.merge(values);

      const alert = {
        success: {
          body: 'Clinic Office Hours Updated',
        },
        error: {
          body: 'Clinic Office Hours Update Failed',
        },
      };
      this.props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule, alert });
    };

    let schedules = null;
    if (weeklySchedule) {
      schedules = weeklySchedule.toJS().weeklySchedules.map((schedule, i) => {
        return (<div>
          <div className={styles.flexHeader}>
            <Header title={`Pattern ${i + 1}`} className={styles.header} />
            <Button className={styles.button} onClick={this.delete.bind(null, i)}>Delete</Button>
          </div>
          <OfficeHoursForm
            weeklySchedule={schedule}
            onSubmit={this.sendEdit.bind(null, i)}
            formName={`officeHours${i}`}
          />
          <Header title="Breaks" className={styles.header} />
          <BreaksForm
            weeklySchedule={schedule}
            onSubmit={this.sendEdit.bind(null, i)}
            formName={`officeHours${i}`}
            breaksName={`clinicBreaks${i}`}
          />
        </div>);
      });
    }

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Save', onClick: this.createPattern, component: RemoteSubmitButton, props: { form: 'advanceCreate' }},
    ];

    return (
      <div>
        <DialogBox
          actions={actions}
          title="Create a New Pattern"
          type="small"
          active={this.state.active}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
          data-test-id="inviteUserDialog"
        >
          <Form
            // className={formStyle}
            form="advanceCreate"
            onSubmit={this.createPattern}
            initialValues={weeklySchedule}
            ignoreSaveButton
          >
            <Field
              required
              component="DayPicker"
              name="startDate"
              label="Start Date"
            />
          </Form>
        </DialogBox>
        <div className={styles.flexHeader}>
          <Header title="Weekly Schedule" className={styles.header} />
          <Button className={styles.button} onClick={this.openModal}>Create New Pattern</Button>
        </div>
        <OfficeHoursForm
          weeklySchedule={weeklySchedule}
          onSubmit={handleSubmit}
          formName="officeHours"
        />
        <Header title="Breaks" className={styles.header} />
        <BreaksForm
          weeklySchedule={weeklySchedule}
          onSubmit={handleSubmit}
          formName="officeHours"
          breaksName="clinicBreaks"
        />
        {schedules}
      </div>
    );
  }
}

OfficeHours.propTypes = {
  activeAccount: PropTypes.object,
  weeklySchedule: PropTypes.object,
  updateEntityRequest: PropTypes.func,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  if (!activeAccount) {
    return {};
  }

  const weeklySchedule = entities.getIn([
    'weeklySchedules',
    'models',
    activeAccount.get('weeklyScheduleId'),
  ]);

  return {
    weeklySchedule,
    activeAccount,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default enhance(OfficeHours);
