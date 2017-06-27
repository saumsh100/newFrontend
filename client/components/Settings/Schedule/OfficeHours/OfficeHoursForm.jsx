
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import 'moment-timezone';
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

const generateTimeOptions = (timezone) => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = 5;
  const increments = 60 / increment;

  let i;
  for (i = 0; i < totalHours; i++) {
    let j;
    for (j = 0; j < increments; j++) {
      const time = (timezone ? moment.tz(new Date(Date.UTC(1970, 1, 0, i, j * increment)), timezone) : moment(new Date(1970, 1, 0, i, j * increment)));
      const value = time.toISOString();
      const label = time.utc().format('LT');
      timeOptions.push({ value, label });
    }
  }

  return timeOptions;
};

const timeOptions = generateTimeOptions;

function OfficeHoursForm({ values, weeklySchedule, onSubmit, formName, activeAccount }) {
  // TODO: finish fetchEntitiesHOC so we dont have to do this...
  if (!weeklySchedule) {
    return null;
  };

  function submit(value) {
    const valueCopy = {};
    Object.keys(value).forEach((key) => {
      valueCopy[key] = {};
      valueCopy[key].isClosed = value[key].isClosed;
      const now = moment(value[key].startTime);
      const another = now.clone();
      another.tz(timezone);

      another.utcOffset(moment(value[key].startTime).tz(timezone).format('Z'));

      now.add(-1 * another.utcOffset(), 'minutes');

      const nowEnd = moment(value[key].endTime);
      const anotherEnd = nowEnd.clone();

      anotherEnd.utcOffset(moment(value[key].endTime).tz(timezone).format('Z'));

      nowEnd.add(-1 * anotherEnd.utcOffset(), 'minutes');

      valueCopy[key].endTime = nowEnd._d;

      valueCopy[key].startTime = now._d;
    });

    onSubmit(valueCopy)
  }

  const timezone = activeAccount.toJS().timezone;

  const options = timeOptions(timezone);


  const parsedWeeklySchedule = pick(weeklySchedule, [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]);

  // Need to do this so editing breaks does not screw up initialValues here
  const initialValues = mapValues(parsedWeeklySchedule, ({ isClosed, startTime, endTime }) => {
    const startDate = (timezone ? moment(startTime).tz(timezone).format('YYYY-MM-DDTHH:mm:ss.SSS') : startTime);
    const endDate = (timezone ? moment(endTime).tz(timezone).add(moment.tz.guess()).format('YYYY-MM-DDTHH:mm:ss.SSS') : endTime);
    return {
      isClosed,
      startTime: startDate + 'Z',
      endTime: endDate + 'Z',
    };
  });

  const DayHoursForm = ({ day }) => {
    // Hacky way of letting internal form values control component state
    const dayValues = values[day];
    const isDisabled = dayValues && dayValues.isClosed;
    return (
      <FormSection name={day}>
        <Grid className={styles.dayGrid}>
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
              <Grid>
                <Row>
                  <Col xs={4} className={styles.flexCentered}>
                    <Field
                      component="DropdownSelect"
                      options={options}
                      name="startTime"
                      className={styles.inlineBlock}
                      disabled={isDisabled}
                      label="Start Time"
                    />
                  </Col>
                  <Col xs={1} className={styles.flexCentered}>
                    <div className={classNames(styles.inlineBlock, isDisabled ? styles.toDivDisabled : styles.toDiv)}>
                      to
                    </div>
                  </Col>
                  <Col xs={4} className={styles.flexCentered}>
                    <Field
                      className={styles.inlineBlock}
                      component="DropdownSelect"
                      options={options}
                      name="endTime"
                      disabled={isDisabled}
                      label="End Time"
                    />
                  </Col>
                  <Col xs={3} />
                </Row>
              </Grid>
            </Col>
          </Row>
        </Grid>
      </FormSection>
    );
  };

  return (
    <Form
      form={formName}
      onSubmit={submit}
      initialValues={initialValues}
    >
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

function mapStateToProps({ form, entities, auth }, { formName }) {

  // form data is populated when component renders
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  if (!form[formName] ) {
    return {
      values: {},
      activeAccount,
    };
  }

  return {
    activeAccount,
    values: form[formName].values,
  };
}

export default connect(mapStateToProps, null)(OfficeHoursForm);
