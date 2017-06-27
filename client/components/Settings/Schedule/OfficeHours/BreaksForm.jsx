
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import { connect } from 'react-redux';
import {
  Button,
  IconButton,
  Grid,
  Row,
  Col,
  Form,
  FormSection,
  Field,
  FieldArray,
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

const defaultStartTime = moment(new Date(1970, 1, 0, 12, 0)).toISOString();
const defaultEndTime = moment(new Date(1970, 1, 0, 13, 0)).toISOString();

const timeOptions = generateTimeOptions;

console.log('found?', timeOptions().find(to => to.value === defaultStartTime));

function BreaksForm({ values, weeklySchedule, onSubmit, breaksName, activeAccount }) {
  // TODO: finish fetchEntitiesHOC so we dont have to do this...
  if (!weeklySchedule) return null;

  const parsedWeeklySchedule = pick(weeklySchedule, [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]);

  function submit(value) {
    const valueCopy = {};
    Object.keys(value).forEach((key) => {
      const breakDay = value[key].breaks || [];
      valueCopy[key] = {};
      valueCopy[key].breaks = breakDay.map((breaks) => {
        const now = moment(breaks.startTime);
        const another = now.clone();
        another.tz(timezone);

        another.utcOffset(moment(breaks.startTime).tz(timezone).format('Z'));

        now.add(-1 * another.utcOffset(), 'minutes');

        const nowEnd = moment(breaks.endTime);
        const anotherEnd = nowEnd.clone();

        anotherEnd.utcOffset(moment(breaks.endTime).tz(timezone).format('Z'));

        nowEnd.add(-1 * anotherEnd.utcOffset(), 'minutes');

        return {
          endTime: nowEnd._d,
          startTime: now._d,
        };
      });
    });

    onSubmit(valueCopy)
  }

  const timezone = activeAccount.toJS().timezone;

  const options = timeOptions(timezone);

  const initialValues = mapValues(parsedWeeklySchedule, (day) => {
    const breakDay = day.breaks || [];
    const breaks = breakDay.map((value) => {
      const startDate = (timezone ? moment(value.startTime).tz(timezone).format('YYYY-MM-DDTHH:mm:ss.SSS') : []);
      const endDate = (timezone ? moment(value.endTime).tz(timezone).add(moment.tz.guess()).format('YYYY-MM-DDTHH:mm:ss.SSS') : []);
      return {
        startTime: startDate + 'Z',
        endTime: endDate + 'Z',
      };
    });
    return { breaks };
  });

  const renderBreaks = (day) => {
    return ({ fields, meta: { touched, error } }) => {
      return (
        <Grid className={styles.dayGrid}>
          <Row className={styles.breakRow}>
            <Col
              xs={3}
              className={styles.breaksDay}
            >
              {day}
            </Col>
            <Col
              xs={2}
              //className={styles.flexCentered}
            >
              <Button
                type="button"
                icon="plus"
                onClick={() => fields.push({startTime: defaultStartTime, endTime: defaultEndTime})}
              >
                Add Break
              </Button>
            </Col>
            <Col
              xs={7}
              //className={styles.flexCentered}
            >
              <Grid>
                {fields.map((field, index) => {
                  return (
                    <Row key={index}>
                      <Col xs={4} className={styles.flexCentered}>
                        <Field
                          component="DropdownSelect"
                          options={options}
                          name={`${field}.startTime`}
                          className={styles.inlineBlock}
                          label="Start Time"
                        />
                      </Col>
                      <Col xs={1} className={styles.flexCentered}>
                        <div className={classNames(styles.inlineBlock, styles.toDiv)}>
                          to
                        </div>
                      </Col>
                      <Col xs={4} className={styles.flexCentered}>
                        <Field
                          className={styles.inlineBlock}
                          component="DropdownSelect"
                          options={options}
                          name={`${field}.endTime`}
                          label="End Time"
                        />
                      </Col>
                      <Col xs={3} className={styles.flexCentered}>
                        <IconButton
                          type="button"
                          icon="trash"
                          className={styles.trashButton}
                          onClick={() => fields.remove(index)}
                        />
                      </Col>
                    </Row>
                  );
                })}
              </Grid>
            </Col>
          </Row>
        </Grid>
      );
    };
  };

  const DayBreaksForm = ({ day }) => {
    // Hacky way of letting internal form values control component state
    const dayValues = values[day];
    // const isDisabled = dayValues && dayValues.isClosed;
    return (
      <FormSection name={day}>
        <FieldArray
          name="breaks"
          component={renderBreaks(day)}
        />
      </FormSection>
    );
  };
  return (
    <Form
      form={breaksName}
      onSubmit={submit}
      initialValues={initialValues}
    >
      <DayBreaksForm day="monday" />
      <DayBreaksForm day="tuesday" />
      <DayBreaksForm day="wednesday" />
      <DayBreaksForm day="thursday" />
      <DayBreaksForm day="friday" />
      <DayBreaksForm day="saturday" />
      <DayBreaksForm day="sunday" />
    </Form>
  );

}

function mapStateToProps({ form, entities, auth }, {formName}) {
  // form data is populated when component renders
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  if (!form[formName]) {
    return {
      values: {},
    };
  }

  return {
    activeAccount,
    values: form[formName].values,
  };
}

export default connect(mapStateToProps, null)(BreaksForm);
