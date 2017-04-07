
import React, { Component, PropTypes } from 'react';
import { Form, Field, IconButton, Toggle } from '../../../../library';
import _ from 'lodash';
import { change } from 'redux-form';
import { connect } from 'react-redux';


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
  let tempTime = new Date(time);
  let newTime = new Date(1970, 1, 0);
  newTime.setHours(tempTime.getHours());
  newTime.setMinutes(tempTime.getMinutes());
  return newTime.toISOString();
}


class CreateTimeOffForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { timeOff, formName, handleSubmit, deleteTimeOff, values } = this.props;

    let initialValues = {
      allDay: true,
    };

    let showDeleteButton = null;
    let startTime = null;
    let endTime = null;

    if (timeOff) {
      initialValues = {
        startDate: timeOff.get('startDate'),
        endDate: timeOff.get('endDate'),
        allDay: timeOff.get('allDay'),
      };
      showDeleteButton = (
        <IconButton icon="trash" onClick={deleteTimeOff} />
      );
    }

    if (!values.allDay) {
      startTime = (<Field component="DropdownSelect" options={timeOptions} name="startTime" label="Start Time" />);
      endTime = (<Field component="DropdownSelect" options={timeOptions} name="endTime" label="End Time" />);
    }


    return (
      <div>
        {showDeleteButton}
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
          {startTime}
          {endTime}
          <Field
            component="Toggle"
            name="allDay"
            onChange={this.handleToggle}
          />
        </Form>
      </div>
    );
  }
}

CreateTimeOffForm.PropTypes = {

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


export default connect(mapStateToProps,null)(CreateTimeOffForm);
