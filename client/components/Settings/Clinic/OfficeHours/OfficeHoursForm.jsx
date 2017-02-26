
import React from 'react';
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

export default function OfficeHoursForm() {
  const initialValues = {
    monday: { isClosed: false },
    tuesday: { isClosed: false },
    wednesday: { isClosed: false },
    thursday: { isClosed: false },
    friday: { isClosed: false },
    saturday: { isClosed: true },
    sunday: { isClosed: true },
  };

  const DayHoursForm = ({ day }) => (
    <FormSection name={day}>
      <Grid>
        <Row>
          <Col xs={5} className={styles.day}>{day}</Col>
          <Col xs={2}><Field component="Toggle" name="isClosed" flipped /></Col>
          <Col xs={5}>Select Fields</Col>
        </Row>
      </Grid>
    </FormSection>
  );

  return (
    <Form form="officeHours" onSubmit={submit} initialValues={initialValues}>
      <DayHoursForm day="monday" />
      <DayHoursForm day="tuesday" />
      <DayHoursForm day="wednesday" />
      <DayHoursForm day="thursday" />
      <DayHoursForm day="friday" />
      <DayHoursForm day="saturday" />
      <DayHoursForm day="sunday" />
      <Button type="submit" label="Submit me!" />
    </Form>
  );
}
