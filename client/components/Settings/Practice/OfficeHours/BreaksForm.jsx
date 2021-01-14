
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pick from 'lodash/pick';
import { connect } from 'react-redux';
import mapValues from 'lodash/mapValues';
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
  getISODate,
  generateTimeBreaks,
  parseDate,
} from '../../../library/index';
import { weeklyScheduleShape } from '../../../library/PropTypeShapes/weeklyScheduleShape';
import styles from './styles.scss';

const BreaksForm = ({ weeklySchedule, onSubmit, breaksName, dataId, breaksIndex, timezone }) => {
  // TODO: finish fetchEntitiesHOC so we dont have to do this...
  if (!weeklySchedule) return null;
  const defaultStartTime = getISODate(new Date(1970, 1, 0, 12, 0), timezone);
  const defaultEndTime = getISODate(new Date(1970, 1, 0, 13, 0), timezone);
  const parsedWeeklySchedule = pick(weeklySchedule, [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const timeOptions = useMemo(
    () =>
      generateTimeBreaks({
        timezone,
        timeOnly: false,
      }),
    [timezone],
  );
  const initialValues = mapValues(parsedWeeklySchedule, (day) => {
    const breaks = day.breaks || [];
    const formatedBreaks = breaks.map(({ startTime, endTime }) => ({
      startTime: parseDate(startTime, timezone).toISOString(),
      endTime: parseDate(endTime, timezone).toISOString(),
    }));
    return { breaks: formatedBreaks };
  });

  const renderBreaks = (day) => {
    const Breaks = ({ fields }) => (
      <Grid className={styles.dayGrid}>
        <Row className={styles.breakRow}>
          <Col xs={3} className={styles.breaksDay}>
            {day}
          </Col>
          <Col
            xs={2}
            // className={styles.flexCentered}
          >
            <Button
              type="button"
              onClick={() =>
                fields.push({
                  startTime: defaultStartTime,
                  endTime: defaultEndTime,
                })
              }
              data-test-id={`button_${day}_addBreak`}
              secondary
            >
              Add Break
            </Button>
          </Col>
          <Col
            xs={7}
            // className={styles.flexCentered}
          >
            <Grid>
              {fields.map((field, index) => (
                <Row key={`startTime_${field}`}>
                  <Col xs={4} className={styles.flexCentered}>
                    <Field
                      component="DropdownSelect"
                      options={timeOptions}
                      name={`${field}.startTime`}
                      className={styles.inlineBlock}
                      label="Start Time"
                      data-test-id={`input_${day}BreakStartTime`}
                      search="label"
                    />
                  </Col>
                  <Col xs={1} className={styles.flexCentered}>
                    <div className={classNames(styles.inlineBlock, styles.toDiv)}>to</div>
                  </Col>
                  <Col xs={4} className={styles.flexCentered}>
                    <Field
                      className={styles.inlineBlock}
                      component="DropdownSelect"
                      options={timeOptions}
                      name={`${field}.endTime`}
                      label="End Time"
                      data-test-id={`input_${day}BreakEndTime`}
                      search="label"
                    />
                  </Col>
                  <Col xs={3} className={styles.flexCentered}>
                    <IconButton
                      type="button"
                      icon="trash"
                      className={styles.trashButton}
                      onClick={() => fields.remove(index)}
                      data-test-id={`button_${day}BreakTrash`}
                    />
                  </Col>
                </Row>
              ))}
            </Grid>
          </Col>
        </Row>
      </Grid>
    );

    Breaks.propTypes = { fields: PropTypes.arrayOf(PropTypes.any).isRequired };

    return Breaks;
  };

  const DayBreaksForm = ({ day }) => (
    // Hacky way of letting internal form values control component state
    // const dayValues = values[day];
    // const isDisabled = dayValues && dayValues.isClosed;
    <FormSection name={day}>
      <FieldArray name="breaks" component={renderBreaks(day)} />
    </FormSection>
  );

  DayBreaksForm.propTypes = { day: PropTypes.string.isRequired };

  return (
    <Form
      enableReinitialize
      form={breaksName}
      onSubmit={formValues => onSubmit(breaksIndex, formValues)}
      initialValues={initialValues}
      data-test-id="breaksForm"
      dataId={dataId}
      alignSave="left"
    >
      <div className={styles.paddingBottom}>
        <DayBreaksForm day="monday" />
        <DayBreaksForm day="tuesday" />
        <DayBreaksForm day="wednesday" />
        <DayBreaksForm day="thursday" />
        <DayBreaksForm day="friday" />
        <DayBreaksForm day="saturday" />
        <DayBreaksForm day="sunday" />
      </div>
    </Form>
  );
};

BreaksForm.propTypes = {
  weeklySchedule: PropTypes.shape(weeklyScheduleShape).isRequired,
  onSubmit: PropTypes.func.isRequired,
  breaksName: PropTypes.string,
  dataId: PropTypes.string,
  breaksIndex: PropTypes.number,
  timezone: PropTypes.string.isRequired,
};

BreaksForm.defaultProps = {
  breaksIndex: 0,
  dataId: '',
  breaksName: '',
};

function mapStateToProps({ auth }) {
  return { timezone: auth.get('timezone') };
}

export default connect(mapStateToProps, null)(BreaksForm);
