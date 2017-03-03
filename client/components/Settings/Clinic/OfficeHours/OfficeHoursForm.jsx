
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormSection,
  Field,
} from '../../../library';
import styles from './styles.scss';

const generateTimeOptions = () => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = 5;
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

function OfficeHoursForm({ values, account, weeklySchedule, onSubmit }) {
  // TODO: finish fetchEntitiesHOC so we dont have to do this...
  if (!account || !weeklySchedule) return null;

  const parsedWeeklySchedule = pick(weeklySchedule, [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]);

  const initialValues = mapValues(parsedWeeklySchedule, (day) => {
    return day;
  });

  const DayHoursForm = ({ day }) => {
    // Hacky way of letting internal form values control component state
    const dayValues = values[day];
    const isDisabled = dayValues && dayValues.isClosed;
    return (
      <FormSection name={day}>
        <Grid>
          <Row className={styles.dayRow}>
            <Col
              xs={3}
              className={classNames(isDisabled ? styles.disabledDay : styles.day, styles.flexCentered)}
            >
              {day}
            </Col>
            <Col
              xs={2}
              className={styles.flexCentered}
            >
              <Field component="Toggle" name="isClosed" flipped />
            </Col>
            <Col
              xs={7}
              className={styles.flexCentered}
            >
              <Field
                component="DropdownSelect"
                options={timeOptions}
                name="startTime"
                className={styles.inlineBlock}
                disabled={isDisabled}
                label="Start Time"
              />
              <div className={classNames(styles.inlineBlock, isDisabled ? styles.toDivDisabled : styles.toDiv)}>
                to
              </div>
              <Field
                className={styles.inlineBlock}
                component="DropdownSelect"
                options={timeOptions}
                name="endTime"
                disabled={isDisabled}
                label="End Time"
              />
            </Col>
          </Row>
        </Grid>
      </FormSection>
    );
  };

  return (
    <Form form="officeHours" onSubmit={onSubmit} initialValues={initialValues}>
      <DayHoursForm day="monday" />
      <DayHoursForm day="tuesday" />
      <DayHoursForm day="wednesday" />
      <DayHoursForm day="thursday" />
      <DayHoursForm day="friday" />
      <DayHoursForm day="saturday" />
      <DayHoursForm day="sunday" />
    </Form>
  );
}

function mapStateToProps({ form }) {
  // form data is populated when component renders
  if (!form.officeHours) {
    return {
      values: {},
    };
  }

  return {
    values: form.officeHours.values,
  };
}

export default connect(mapStateToProps, null)(OfficeHoursForm);
