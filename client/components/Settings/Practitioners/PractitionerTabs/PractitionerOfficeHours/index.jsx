
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { batchActions } from 'redux-batched-actions';
import OfficeHoursForm from '../../../Practice/OfficeHours/OfficeHoursForm';
import BreaksForm from '../../../Practice/OfficeHours/BreaksForm';
import {
  Toggle,
  Header,
  DialogBox,
  Form,
  Field,
  RemoteSubmitButton,
  Button,
} from '../../../../library';
import EnabledFeature from '../../../../library/EnabledFeature';
import { SortByName } from '../../../../library/util/SortEntities';
import PractitionerHoursCalendar from './PractitionerHoursCalendar';
import Practitioner from '../../../../../entities/collections/practitioners';
import WeeklyScheduleModel from '../../../../../entities/models/WeeklySchedule';
import styles from '../../styles.scss';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function checkValues(obj) {
  return Object.keys(obj).every(key => obj[key]);
}

class PractitionerOfficeHours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'off',
      active: false,
      activeChair: false,
      modalChairDay: 'monday',
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openModalChair = this.openModalChair.bind(this);
    this.createPattern = this.createPattern.bind(this);
    this.changeStartDate = this.changeStartDate.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
    this.delete = this.delete.bind(this);
    this.chairSubmit = this.chairSubmit.bind(this);
    this.setAllChairs = this.setAllChairs.bind(this);
  }

  componentDidMount() {
    const { practitioner } = this.props;
    const customScheduleValue = practitioner ? practitioner.get('isCustomSchedule') : null;
    const value = customScheduleValue ? 'on' : 'off';
    this.setState({ value });
  }

  setAllChairs(e) {
    e.stopPropagation();

    const { chairs, allChairs } = this.props;

    const actions = chairs.map(chair => change('chairs', chair.id, !allChairs)).toArray();

    this.props.batchActions(actions);
  }

  openModalChair(modalChairDay) {
    this.setState({
      modalChairDay,
      activeChair: true,
    });
  }

  openModal() {
    this.setState({ active: true });
  }

  reinitializeState() {
    this.setState({
      active: false,
      activeChair: false,
    });
  }

  chairSubmit(values, day) {
    const { weeklySchedule } = this.props;
    const newWeeklySchedule = weeklySchedule.toJS();

    newWeeklySchedule[day].chairIds = Object.keys(values).filter(
      key => values[key] && key !== 'day',
    );

    const sendWeeklySchedule = weeklySchedule.merge(newWeeklySchedule);

    const alert = {
      success: { body: `Practitioner Chairs Updated for ${day}` },
      error: { body: 'Practitioner Chairs Update Failed' },
    };

    return this.props
      .updateEntityRequest({
        key: 'weeklySchedule',
        model: sendWeeklySchedule,
        alert,
      })
      .then(() => {
        this.setState({
          active: false,
          activeChair: false,
        });
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

    const weeklyScheduleJS = this.props.weeklySchedule.toJS();
    const weeklySchedule = Object.assign({}, weeklyScheduleJS);
    const weeklyScheduleNew = Object.assign({}, weeklyScheduleJS);
    weeklySchedule.weeklySchedules = weeklySchedule.weeklySchedules || [];

    if (!weeklyScheduleNew.startDate) {
      window.alert('Please put in a start date before creating a pattern!');
      return null;
    }

    delete weeklyScheduleNew.weeklySchedules;
    delete weeklyScheduleNew.startDate;
    delete weeklyScheduleNew.id;

    weeklySchedule.weeklySchedules.push(weeklyScheduleNew);
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
      success: { body: `${this.props.practitioner.get('firstName')} schedule deleted.` },
      error: { body: `${this.props.practitioner.get('firstName')} schedule delete failed.` },
    };

    return this.props.updateEntityRequest({
      key: 'weeklySchedule',
      model: newWeeklySchedule,
      alert,
    });
  }

  sendEdit(index, values, j, k) {
    const i = k.dataId;
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
      success: { body: `${this.props.practitioner.get('firstName')} schedule updated.` },
      error: { body: `${this.props.practitioner.get('firstName')} schedule update failed.` },
    };

    this.props.updateEntityRequest({
      key: 'weeklySchedule',
      model: newWeeklySchedule,
      alert,
    });
  }

  handleToggle(e) {
    e.stopPropagation();
    const { practitioner } = this.props;
    const { value } = this.state;

    const modifiedPractitioner =
      value === 'off'
        ? practitioner.set('isCustomSchedule', true)
        : practitioner.set('isCustomSchedule', false);

    const alert = {
      success: { body: `${practitioner.get('firstName')} schedule updated.` },
      error: { body: `${practitioner.get('firstName')} schedule update failed.` },
    };

    this.props.updateEntityRequest({
      key: 'practitioners',
      model: modifiedPractitioner,
      url: `/api/practitioners/${practitioner.get('id')}/customSchedule`,
      alert,
    });

    const newValue = value === 'off' ? 'on' : 'off';
    this.setState({ value: newValue });
  }

  handleFormUpdate(index, values) {
    const { weeklySchedule, practitioner } = this.props;
    const newWeeklySchedule = Object.assign({}, weeklySchedule.toJS());

    daysOfWeek.forEach((day) => {
      Object.keys(values[day]).forEach((pram) => {
        newWeeklySchedule[day][pram] = values[day][pram];
      });
    });

    const alert = {
      success: { body: `${practitioner.get('firstName')} schedule updated.` },
      error: { body: `${practitioner.get('firstName')} schedule update failed.` },
    };

    this.props.updateEntityRequest({
      key: 'weeklySchedule',
      model: weeklySchedule.merge(newWeeklySchedule),
      alert,
    });
  }

  render() {
    const { weeklySchedule, practitioner, chairs, allChairs } = this.props;
    let schedules = null;
    const initialValuesChairs = {};
    let dialogShow = null;
    if (weeklySchedule) {
      const allSchedules = weeklySchedule.toJS().weeklySchedules || [];

      schedules = allSchedules.map((schedule, i) => (
        <div className={styles.toggleContainer_hours}>
          <div className={styles.orSpacer} />
          <div className={styles.flexHeader}>
            <Header contentHeader title={`Week ${i + 2} Pattern`} className={styles.header} />
            <Button className={styles.button} onClick={this.delete}>
              Delete
            </Button>
          </div>
          <OfficeHoursForm
            weeklySchedule={weeklySchedule.weeklySchedules[i]}
            onSubmit={this.sendEdit}
            formName={`officeHours${i}`}
            dataId={i}
          />
          <Header title="Breaks" className={styles.subHeader} />
          <BreaksForm
            weeklySchedule={weeklySchedule.weeklySchedules[i]}
            onSubmit={this.sendEdit}
            formName={`officeHours${i}`}
            breaksName={`clinicBreaks${i}`}
            dataId={i}
          />
        </div>
      ));

      const filteredChairs = chairs
        .toArray()
        .filter((chair) => {
          if (chair.isActive) {
            return chair;
          }
          return null;
        })
        .sort(SortByName);

      const chairFields = filteredChairs.map((chair) => {
        const { modalChairDay } = this.state;
        initialValuesChairs[chair.id] = weeklySchedule[modalChairDay].chairIds.includes(chair.id);
        return (
          <div className={styles.chairsContainer_fields} key={chair.id}>
            <span className={styles.chairsContainer_name}>{chair.name}</span>
            <div className={styles.chairsContainer_toggle}>
              <Field component="Toggle" name={chair.id} />
            </div>
          </div>
        );
      });

      const actionsChair = [
        {
          label: 'Cancel',
          onClick: this.reinitializeState,
          component: Button,
          props: { border: 'blue' },
        },
        {
          label: 'Save',
          onClick: values => this.chairSubmit(values, this.state.modalChairDay),
          component: RemoteSubmitButton,
          props: {
            form: 'chairs',
            color: 'blue',
          },
        },
      ];

      initialValuesChairs.day = this.state.modalChairDay;

      dialogShow = (
        <DialogBox
          actions={actionsChair}
          title={this.state.modalChairDay.toUpperCase()}
          type="small"
          active={this.state.activeChair}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          {weeklySchedule[this.state.modalChairDay].pmsScheduleId && (
            <div>
              Note: This day field is currently being synced via PMS. Please use PMS to change this
              field for this day
            </div>
          )}
          <div className={styles.chairsContainer}>
            <div className={styles.chairsContainer_all}>
              <span className={styles.chairsContainer_all_text}>All Chairs</span>
              <div className={styles.chairsContainer_toggle}>
                <Toggle name="allChairs" onChange={this.setAllChairs} checked={allChairs} />
              </div>
            </div>
            <Form
              enableReinitialize
              destroyOnUnmount
              ignoreSaveButton
              form="chairs"
              onSubmit={values => this.chairSubmit(values, this.state.modalChairDay)}
              initialValues={initialValuesChairs}
            >
              {chairFields}
            </Form>
          </div>
        </DialogBox>
      );
    }

    let showComponent = null;

    if (practitioner.get('isCustomSchedule')) {
      showComponent = (
        <div className={styles.toggleContainer_hours}>
          <div className={styles.flexHeader}>
            <Header title="Weekly Schedule" contentHeader />
            <div>
              <Button className={styles.button} secondary onClick={this.createPattern}>
                Add New Pattern
              </Button>
              <Button className={styles.button} secondary onClick={this.openModal}>
                Change Start Date
              </Button>
            </div>
          </div>
          <OfficeHoursForm
            key={`${practitioner.get('id')}_Hours`}
            weeklySchedule={weeklySchedule}
            onSubmit={this.handleFormUpdate}
            formName={`${weeklySchedule.get('id')}officeHours`}
            modal
            openModal={day => this.openModalChair(day)}
            hoursIndex={0}
          />
          <Header title="Breaks" className={styles.subHeader} contentHeader />
          <BreaksForm
            key={`${practitioner.get('id')}_Breaks`}
            weeklySchedule={weeklySchedule}
            onSubmit={this.handleFormUpdate}
            formName={`${weeklySchedule.get('id')}officeHours`}
            breaksName={`${weeklySchedule.get('id')}clinicBreaks`}
            breaksIndex={0}
          />
        </div>
      );
    } else {
      showComponent = (
        <div className={styles.notCustom}>
          Currently, {practitioner.getFullName()} is inheriting the same weekly schedule as the
          clinic&#39;s office hours, to make it custom, click the toggle above.
        </div>
      );
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
          form: 'advanceCreatePrac',
          color: 'blue',
        },
      },
    ];

    return (
      <EnabledFeature
        predicate={({ flags }) => flags.get('practitioner-schedule-calendar')}
        render={
          <PractitionerHoursCalendar
            practitioner={practitioner}
            chairs={chairs.filter(({ isActive }) => isActive).toJS()}
          />
        }
        fallback={
          <div className={styles.practScheduleContainer}>
            <div className={styles.toggleContainer}>
              <div className={styles.toggleContainer__text}> Set Custom </div>
              <div className={styles.toggleContainer__toggle}>
                <Toggle
                  defaultChecked={practitioner.get('isCustomSchedule')}
                  value={this.state.value}
                  onChange={this.handleToggle}
                  data-test-id="toggle_setCustom"
                />
              </div>
            </div>
            {showComponent}
            {schedules}

            <DialogBox
              actions={actions}
              title="Create a New Pattern"
              type="small"
              active={this.state.active}
              onEscKeyDown={this.reinitializeState}
              onOverlayClick={this.reinitializeState}
            >
              <Form
                ignoreSaveButton
                form="advanceCreatePrac"
                onSubmit={this.changeStartDate}
                initialValues={weeklySchedule}
              >
                <Field
                  required
                  timezone={this.props.timezone}
                  component="DayPicker"
                  name="startDate"
                  label="Start Date"
                />
              </Form>
            </DialogBox>
            {dialogShow}
          </div>
        }
      />
    );
  }
}

PractitionerOfficeHours.propTypes = {
  allChairs: PropTypes.bool,
  updateEntityRequest: PropTypes.func.isRequired,
  batchActions: PropTypes.func.isRequired,
  chairs: PropTypes.instanceOf(Map),
  weeklySchedule: PropTypes.instanceOf(WeeklyScheduleModel),
  practitioner: PropTypes.instanceOf(Practitioner).isRequired,
  timezone: PropTypes.string.isRequired,
};

PractitionerOfficeHours.defaultProps = {
  weeklySchedule: null,
  allChairs: false,
  chairs: null,
};

const mapStateToProps = ({ form, auth }) => ({
  accountId: auth.get('accountId'),
  allChairs: form.chairs ? checkValues(form.chairs.values) : null,
  timezone: auth.get('timezone'),
});

const mapActionsToProps = dispatch => bindActionCreators({ batchActions }, dispatch);

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(PractitionerOfficeHours);
