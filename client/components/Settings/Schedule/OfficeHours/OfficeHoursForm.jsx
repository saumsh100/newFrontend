
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import { connect } from 'react-redux';
import { Button, Grid, Row, Col, Form, FormSection, Field, Icon } from '../../../library';
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

function OfficeHoursForm({ values, weeklySchedule, onSubmit, formName, dataId, modal, openModal }) {
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

  // Need to do this so editing breaks does not screw up initialValues here
  const initialValues = mapValues(parsedWeeklySchedule, ({ isClosed, startTime, endTime }) => ({
    isClosed,
    startTime,
    endTime,
  }));

  const DayHoursForm = ({ day }) => {
    // Hacky way of letting internal form values control component state
    const dayValues = values[day];
    const isDisabled = dayValues && dayValues.isClosed;
    return (
      <FormSection name={day}>
        <Grid className={styles.dayGrid}>
          <Row className={styles.dayRow} data-test-id={day}>
            <Col
              xs={3}
              className={classNames(
                isDisabled ? styles.disabledDay : styles.day,
                styles.flexCentered
              )}
            >
              {day}
            </Col>
            <Col xs={2} className={styles.flexCentered} data-test-id={`toggle_${day}`}>
              <Field component="Toggle" name="isClosed" flipped />
            </Col>
            <Col xs={7} className={styles.flexCentered}>
              <Grid>
                <Row>
                  <Col
                    xs={4}
                    className={styles.flexCentered}
                    data-test-id={`dropDown_${day}_startTime`}
                  >
                    <Field
                      component="DropdownSelect"
                      options={timeOptions}
                      name="startTime"
                      className={styles.inlineBlock}
                      disabled={isDisabled}
                      label="Start Time"
                      search="label"
                    />
                  </Col>
                  <Col xs={1} className={styles.flexCentered}>
                    <div
                      className={classNames(
                        styles.inlineBlock,
                        isDisabled ? styles.toDivDisabled : styles.toDiv
                      )}
                    >
                      to
                    </div>
                  </Col>
                  <Col xs={4} className={styles.flexCentered}>
                    <Field
                      className={styles.inlineBlock}
                      component="DropdownSelect"
                      options={timeOptions}
                      name="endTime"
                      disabled={isDisabled}
                      label="End Time"
                      search="label"
                    />
                  </Col>
                  {modal ? (
                    <Icon className={styles.icon} icon="cog" onClick={() => openModal(day)} />
                  ) : null}
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
      enableReinitialize
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id="officeHoursForm"
      dataId={dataId}
      className={styles.formContainer}
      alignSave="left"
    >
      <div className={styles.paddingBottom}>
        <DayHoursForm day="monday" />
        <DayHoursForm day="tuesday" />
        <DayHoursForm day="wednesday" />
        <DayHoursForm day="thursday" />
        <DayHoursForm day="friday" />
        <DayHoursForm day="saturday" />
        <DayHoursForm day="sunday" />
      </div>
    </Form>
  );
}

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

export default connect(mapStateToProps, null)(OfficeHoursForm);
