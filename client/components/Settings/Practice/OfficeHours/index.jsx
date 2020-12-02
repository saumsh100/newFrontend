
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import OfficeHoursForm from './OfficeHoursForm';
import BreaksForm from './BreaksForm';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import { Header, Button, DialogBox, Form, Field } from '../../../library';
import EnabledFeature from '../../../library/EnabledFeature';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import { weeklyScheduleShape } from '../../../library/PropTypeShapes/weeklyScheduleShape';
import SettingsCard from '../../Shared/SettingsCard';
import styles from './styles.scss';
import OfficeHoursCalendar from './OfficeHoursCalendar';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

class OfficeHours extends Component {
  constructor(props) {
    super(props);

    this.state = { active: false };

    this.reinitializeState = this.reinitializeState.bind(this);
    this.openModal = this.openModal.bind(this);
    this.createPattern = this.createPattern.bind(this);
    this.changeStartDate = this.changeStartDate.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
    this.delete = this.delete.bind(this);
  }

  reinitializeState() {
    this.setState({ active: false });
  }

  delete(i) {
    const deleteSche = window.confirm('Delete Schedule?');

    if (!deleteSche) {
      return null;
    }

    const weeklySchedule = Object.assign({}, this.props.weeklySchedule.toJS());
    weeklySchedule.weeklySchedules.splice(i, 1);

    if (!weeklySchedule.weeklySchedules[0]) {
      weeklySchedule.isAdvanced = false;
    }

    const newWeeklySchedule = this.props.weeklySchedule.merge(weeklySchedule);

    const alert = {
      success: { body: 'Clinic Pattern Deleted' },
      error: { body: 'Clinic Pattern Deleted Failed' },
    };

    return this.props.updateEntityRequest({
      key: 'weeklySchedule',
      model: newWeeklySchedule,
      alert,
    });
  }

  sendEdit(i, values) {
    const weeklySchedule = Object.assign({}, this.props.weeklySchedule.toJS());

    weeklySchedule.weeklySchedules = weeklySchedule.weeklySchedules || [];

    Object.keys(values).forEach((key) => {
      if (values[key].breaks) {
        weeklySchedule.weeklySchedules[i][key].breaks = values[key].breaks;
      } else {
        const { breaks } = weeklySchedule.weeklySchedules[i][key];
        weeklySchedule.weeklySchedules[i][key] = values[key];
        weeklySchedule.weeklySchedules[i][key].breaks = breaks;
      }
    });

    const newWeeklySchedule = this.props.weeklySchedule.merge(weeklySchedule);

    const alert = {
      success: { body: 'Clinic Office Hours Updated' },
      error: { body: 'Clinic Office Hours Update Failed' },
    };

    this.props.updateEntityRequest({
      key: 'weeklySchedule',
      model: newWeeklySchedule,
      alert,
    });
  }

  changeStartDate(values) {
    const weeklySchedule = Object.assign({}, this.props.weeklySchedule.toJS());
    weeklySchedule.startDate = values.startDate;
    const newWeeklySchedule = this.props.weeklySchedule.merge(weeklySchedule);

    const alert = {
      success: { body: 'Clinic Office Hours Updated' },
      error: { body: 'Clinic Office Hours Update Failed' },
    };

    return this.props
      .updateEntityRequest({
        key: 'weeklySchedule',
        model: newWeeklySchedule,
        alert,
      })
      .then(() => {
        this.setState({ active: false });
      });
  }

  createPattern() {
    const createPattern = window.confirm('Are you sure you want to create a pattern?');

    if (!createPattern) {
      return null;
    }

    const weeklySchedule = Object.assign({}, this.props.weeklySchedule.toJS());
    const weeklyScheduleNew = Object.assign({}, this.props.weeklySchedule.toJS());

    weeklySchedule.weeklySchedules = weeklySchedule.weeklySchedules || [];

    if (!weeklyScheduleNew.startDate) {
      window.alert('Please put in a start date before creating a pattern!');
      return null;
    }

    delete weeklyScheduleNew.weeklySchedules;
    delete weeklyScheduleNew.startDate;
    delete weeklyScheduleNew.id;

    weeklySchedule.weeklySchedules.push(weeklyScheduleNew);
    // weeklySchedule.startDate = values.startDate;
    weeklySchedule.isAdvanced = true;

    const newWeeklySchedule = this.props.weeklySchedule.merge(weeklySchedule);

    const alert = {
      success: { body: 'Clinic Office Hours Updated' },
      error: { body: 'Clinic Office Hours Update Failed' },
    };

    return this.props
      .updateEntityRequest({
        key: 'weeklySchedule',
        model: newWeeklySchedule,
        alert,
      })
      .then(() => {
        this.setState({ active: false });
      });
  }

  openModal() {
    this.setState({ active: true });
  }

  render() {
    const { weeklySchedule, timezone } = this.props;
    const handleSubmit = (index, values) => {
      const alert = {
        success: { body: 'Clinic Office Hours Updated' },
        error: { body: 'Clinic Office Hours Update Failed' },
      };

      const newWeeklySchedule = Object.assign({}, weeklySchedule.toJS());

      daysOfWeek.forEach((day) => {
        Object.keys(values[day]).forEach((pram) => {
          newWeeklySchedule[day][pram] = values[day][pram];
        });
      });

      this.props.updateEntityRequest({
        key: 'weeklySchedule',
        model: weeklySchedule.merge(newWeeklySchedule),
        alert,
      });
    };

    let schedules = null;
    if (weeklySchedule && weeklySchedule.toJS().weeklySchedules) {
      schedules = weeklySchedule.toJS().weeklySchedules.map((schedule, i) => (
        <div>
          <div className={styles.orSpacer} />
          <div className={styles.flexHeader} data-test-id={`pattern_${i}`}>
            <Header contentHeader title={`Week ${i + 2} Pattern`} className={styles.header} />
            <Button className={styles.button} onClick={this.delete}>
              Delete
            </Button>
          </div>
          <OfficeHoursForm
            weeklySchedule={schedule}
            onSubmit={this.sendEdit}
            formName={`officeHours${i}`}
            hoursIndex={i}
          />
          <Header title="Breaks" className={styles.subHeader} />
          <BreaksForm
            weeklySchedule={schedule}
            onSubmit={this.sendEdit}
            formName={`officeHours${i}`}
            breaksName={`clinicBreaks${i}`}
            breaksIndex={i}
          />
        </div>
      ));
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
        onClick: this.changeStartDate,
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: 'advanceCreate',
        },
      },
    ];

    return (
      <SettingsCard title="Office Hours" bodyClass={styles.officeHoursBody}>
        <EnabledFeature
          predicate={({ flags }) => flags.get('office-hours-calendar-schedule')}
          render={<OfficeHoursCalendar />}
          fallback={
            <div>
              <DialogBox
                actions={actions}
                title="Update StartDate"
                type="small"
                active={this.state.active}
                onEscKeyDown={this.reinitializeState}
                onOverlayClick={this.reinitializeState}
                data-test-id="inviteUserDialog"
              >
                <Form
                  form="advanceCreate"
                  onSubmit={this.changeStartDate}
                  initialValues={weeklySchedule}
                  ignoreSaveButton
                  data-test-id="advanceCreate"
                >
                  <Field
                    required
                    component="DayPicker"
                    name="startDate"
                    label="Start Date"
                    data-test-id="input_startDateDayPicker"
                    timezone={timezone}
                  />
                </Form>
              </DialogBox>
              <div className={styles.flexHeader}>
                <Header title="Weekly Schedule" contentHeader className={styles.header} />
                <div>
                  <Button
                    className={styles.button}
                    onClick={this.createPattern}
                    data-test-id="button_createPatternSchedule"
                    secondary
                  >
                    Add New Pattern
                  </Button>
                  <Button
                    className={styles.button}
                    onClick={this.openModal}
                    data-test-id="button_changeStartDate"
                    secondary
                  >
                    Change Start Date
                  </Button>
                </div>
              </div>
              <OfficeHoursForm
                weeklySchedule={weeklySchedule}
                onSubmit={handleSubmit}
                formName="officeHours"
                hoursIndex={0}
              />
              <Header title="Breaks" contentHeader className={styles.subHeader} />
              <BreaksForm
                weeklySchedule={weeklySchedule}
                onSubmit={handleSubmit}
                formName="officeHours"
                breaksName="clinicBreaks"
                breaksIndex={0}
              />
              {schedules}
            </div>
          }
        />
      </SettingsCard>
    );
  }
}

OfficeHours.propTypes = {
  weeklySchedule: PropTypes.shape(weeklyScheduleShape),
  updateEntityRequest: PropTypes.func,
  timezone: PropTypes.string.isRequired,
};

OfficeHours.defaultProps = {
  weeklySchedule: null,
  updateEntityRequest: null,
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const timezone = auth.get('timezone');

  if (!activeAccount) {
    return { timezone };
  }

  const weeklySchedule = entities.getIn([
    'weeklySchedules',
    'models',
    activeAccount.get('weeklyScheduleId'),
  ]);

  return {
    weeklySchedule,
    activeAccount,
    timezone,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateEntityRequest }, dispatch);
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(OfficeHours);
