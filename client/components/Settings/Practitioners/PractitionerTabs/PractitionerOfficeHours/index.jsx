import React, { Component, PropTypes } from 'react';
import OfficeHoursForm from '../../../Schedule/OfficeHours/OfficeHoursForm';
import BreaksForm from '../../../Schedule/OfficeHours/BreaksForm';
import { Toggle, Header, Row, Col, DialogBox, Form, Field, RemoteSubmitButton, Button } from '../../../../library';
import styles from '../../styles.scss';

class PractitionerOfficeHours extends Component{

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      active: false,
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleFormUpdate = this.handleFormUpdate.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.openModal = this.openModal.bind(this);
    this.createPattern = this.createPattern.bind(this);
    this.changeStartDate = this.changeStartDate.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentWillMount() {
    const { practitioner } = this.props;
    const customScheduleValue = practitioner ? practitioner.get('isCustomSchedule') : null
    const value = customScheduleValue ? 'on' : 'off';
    this.setState({ value });
  }

  reinitializeState() {
    this.setState({
      active: false,
    });
  }

  openModal() {
    this.setState({
      active: true,
    });
  }

  changeStartDate(values) {
    const weeklySchedule = Object.assign({}, this.props.weeklySchedule.toJS());
    weeklySchedule.startDate = values.startDate;
    const newWeeklySchedule = this.props.weeklySchedule.merge(weeklySchedule);

    const alert = {
      success: {
        body: 'Clinic Office Hours Updated',
      },
      error: {
        body: 'Clinic Office Hours Update Failed',
      },
    };

    return this.props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule, alert })
    .then(() => {
      this.setState({
        active: false,
      });
    });
  }

  createPattern(values) {
    const createPattern = confirm('Are you sure you want to create a pattern?');

    if (!createPattern) {
      return null;
    }

    const weeklySchedule = Object.assign({}, this.props.weeklySchedule.toJS());
    const weeklyScheduleNew = Object.assign({}, this.props.weeklySchedule.toJS());

    if (!weeklyScheduleNew.startDate) {
      alert('Please put in a start date before creating a pattern!');
      return null;
    }

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

    return this.props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule, alert })
    .then(() => {
      this.setState({
        active: false,
      });
    });
  }

  delete(i) {
    const deleteSche = confirm('Delete Schedule?');

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
      success: {
        body: `${this.props.practitioner.get('firstName')} schedule deleted.`,
      },
      error: {
        body: `${this.props.practitioner.get('firstName')} schedule delete failed.`,
      },
    };

    return this.props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule, alert });
  }

  sendEdit(values, j, k) {
    const i = k.dataId;
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
        body: `${this.props.practitioner.get('firstName')} schedule updated.`,
      },
      error: {
        body: `${this.props.practitioner.get('firstName')} schedule update failed.`,
      },
    };

    this.props.updateEntityRequest({ key: 'weeklySchedule', model: newWeeklySchedule, alert });
  }

  handleToggle(e) {
    e.stopPropagation();
    const { practitioner } = this.props;
    const { value } = this.state;

    const modifiedPractitioner = ((value === 'off') ?
      practitioner.set('isCustomSchedule', true) : practitioner.set('isCustomSchedule', false));

    const alert = {
      success: {
        body: `${practitioner.get('firstName')} schedule updated.`,
      },
      error: {
        body: `${practitioner.get('firstName')} schedule update failed.`,
      },
    };

    this.props.updateEntityRequest({
      key: 'practitioners',
      model: modifiedPractitioner,
      url: `/api/practitioners/${practitioner.get('id')}/customSchedule`,
      alert,
    });

    const newValue = (value === 'off') ? 'on' : 'off';
    this.setState({ value: newValue });
  }

  handleFormUpdate(values) {
    const { weeklySchedule, practitioner } = this.props;
    const newWeeklySchedule = weeklySchedule.merge(values);

    const alert = {
      success: {
        body: `${practitioner.get('firstName')} schedule updated.`,
      },
      error: {
        body: `${practitioner.get('firstName')} schedule update failed.`,
      },
    };

    this.props.updateEntityRequest({
      key: 'weeklySchedule',
      model: newWeeklySchedule,
      alert,
    });
  }

  render() {
    const { weeklySchedule, practitioner } = this.props;

    let schedules = null;
    if (weeklySchedule) {
      schedules = weeklySchedule.weeklySchedules.map((schedule, i) => {
        return (<div className={styles.toggleContainer_hours}>
          <div className={styles.orSpacer} />
          <div className={styles.flexHeader}>
            <Header title={`Pattern ${i + 1}`} className={styles.header} />
            <Button className={styles.button} onClick={this.delete.bind(null, i)}>Delete</Button>
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
        </div>);
      });
    }


    let showComponent = null;

    if (practitioner.get('isCustomSchedule')) {
      showComponent = (
        <div className={styles.toggleContainer_hours}>
          <div className={styles.flexHeader}>
            <Header title="Weekly Schedule"/>
            <div>
              <Button className={styles.button} onClick={this.createPattern}>Create New Pattern</Button>
              <Button className={styles.button} onClick={this.openModal}>Change Start Date</Button>
            </div>
          </div>
          <OfficeHoursForm
            key={`${practitioner.get('id')}_Hours`}
            weeklySchedule={weeklySchedule}
            onSubmit={this.handleFormUpdate}
            formName={`${weeklySchedule.get('id')}officeHours`}
          />
          <Header title="Breaks" className={styles.subHeader} />
          <BreaksForm
            key={`${practitioner.get('id')}_Breaks`}
            weeklySchedule={weeklySchedule}
            onSubmit={this.handleFormUpdate}
            formName={`${weeklySchedule.get('id')}officeHours`}
            breaksName={`${weeklySchedule.get('id')}clinicBreaks`}
          />
        </div>
      );
    } else {
      showComponent = (
        <div className={styles.notCustom}>
          Currently, { practitioner.getFullName() } is inheriting the same weekly
          schedule as the clinic's office hours,
          to make it custom, click the toggle above.
        </div>
      );
    }

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Save', onClick: this.changeStartDate, component: RemoteSubmitButton, props: { form: 'advanceCreatePrac' }},
    ];

    return (
      <div className={styles.practScheduleContainer}>
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
            form="advanceCreatePrac"
            onSubmit={this.changeStartDate}
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
        <div className={styles.toggleContainer}>
          <div> Set Custom </div>
          <div className={styles.toggleContainer__toggle}>
            <Toggle
              defaultChecked={practitioner.get('isCustomSchedule')}
              value={this.state.value}
              onChange={this.handleToggle}
            />
          </div>
        </div>
        {showComponent}
        {schedules}
      </div>
    );
  }
}

PractitionerOfficeHours.propTypes = {
  activeAccount: PropTypes.object,
  weeklySchedule: PropTypes.object,
  practitioner: PropTypes.object,
  updateEntityRequest: PropTypes.func,
};

export default PractitionerOfficeHours;
