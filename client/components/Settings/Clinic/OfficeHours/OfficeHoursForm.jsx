
import React from 'react';
import classNames from 'classnames';
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

function submit(values) {
  alert(JSON.stringify(values));
}

const generateTimeOptions = () => {
  const timeOptions = [];
  const increments = 12 * 12;

  let i;
  for (i = 0; i < increments; i++) {
    timeOptions.push({ value: i + 'AM' });
  }

  return timeOptions;
};

function OfficeHoursForm({ values }) {
  const initialValues = {
    monday: { isClosed: false },
    tuesday: { isClosed: false },
    wednesday: { isClosed: false },
    thursday: { isClosed: false },
    friday: { isClosed: false },
    saturday: { isClosed: true },
    sunday: { isClosed: true },
  };

  const DayHoursForm = ({ day }) => {
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
                options={generateTimeOptions()}
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
                options={generateTimeOptions()}
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
    <Form form="officeHours" onSubmit={submit} initialValues={initialValues}>
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
