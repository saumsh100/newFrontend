
import React, { PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Form, Field, Icon } from '../../../../library';

const generateTimeOptions = () => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = 60;
  const increments = 60 / increment;

  let i;
  for (i = 0; i < totalHours; i++) {
    let j;
    for (j = 0; j < increments; j++) {
      const time = moment(new Date(1970, 1, 0, i, j * increment));
      const value = time.toISOString();
      const label = time.format('LT');
      timeOptions.push({ value, label });
    }
  }

  return timeOptions;
};

const timeOptions = generateTimeOptions();

const setTime = (time) => {
  const tempTime = new Date(time);
  const mergeTime = new Date(1970, 1, 0);
  mergeTime.setHours(tempTime.getHours());
  return mergeTime.toISOString();
};

function TimeOffForm(props) {
  const { timeOff, formName, handleSubmit, values } = props;

  const {
    startDate,
    endDate,
    allDay,
    note,
  } = timeOff.toJS();

  const initialValues = {
    startDate: moment(startDate).format('L'),
    endDate: moment(endDate).format('L'),
    allDay,
    startTime: setTime(startDate),
    endTime: setTime(endDate),
    note,
  };

  // TODO: style these components with hidden class if values.allDay
  const startTimeComponent = (<Field component="DropdownSelect" options={timeOptions} name="startTime" label="Start Time" disabled={values.allDay} />);
  const endTimeComponent = (<Field component="DropdownSelect" options={timeOptions} name="endTime" label="End Time" disabled={values.allDay} />);

  return (
    <Form
      form={formName}
      onSubmit={handleSubmit}
      initialValues={initialValues}
    >
      <Field
        component="Calendar"
        name="startDate"
        label="Start Date"
      />
      <Field
        component="Calendar"
        name="endDate"
        label="End Date"
      />
      {startTimeComponent}
      {endTimeComponent}
      <Field
        component="Toggle"
        name="allDay"
      />
      More Details:
      <Field
        name="note"
        label="Note"
      />
    </Form>
  );
}

TimeOffForm.PropTypes = {
  timeOff: PropTypes.object,
  formName: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
};

function mapStateToProps({ form }, { formName }) {
  // form data is populated when component renders
  if (!form[formName]) {
    return {
      values: {},
    };
  }

  return {
    values: form[formName].values,
  };
}

export default connect(mapStateToProps,null)(TimeOffForm);
