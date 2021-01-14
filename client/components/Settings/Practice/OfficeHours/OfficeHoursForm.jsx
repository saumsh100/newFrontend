
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import { connect } from 'react-redux';
import {
  Grid,
  Row,
  Col,
  Form,
  FormSection,
  Field,
  IconButton,
  generateTimeBreaks,
  parseDate,
} from '../../../library';
import { weeklyScheduleShape } from '../../../library/PropTypeShapes/weeklyScheduleShape';
import styles from './styles.scss';

function OfficeHoursForm({
  values,
  weeklySchedule,
  onSubmit,
  formName,
  dataId,
  modal,
  openModal,
  hoursIndex,
  timezone,
}) {
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const timeOptions = useMemo(
    () =>
      generateTimeBreaks({
        timezone,
        timeOnly: false,
      }),
    [timezone],
  );

  // Need to do this so editing breaks does not screw up initialValues here
  const initialValues = mapValues(parsedWeeklySchedule, ({ isClosed, startTime, endTime }) => ({
    isClosed,
    startTime: parseDate(startTime, timezone).toISOString(),
    endTime: parseDate(endTime, timezone).toISOString(),
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
                styles.flexCentered,
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
                  <Col xs={4} className={styles.flexCentered}>
                    <Field
                      data-test-id={`dropDown_${day}_startTime`}
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
                        isDisabled ? styles.toDivDisabled : styles.toDiv,
                      )}
                    >
                      to
                    </div>
                  </Col>
                  <Col xs={4} className={styles.flexCentered}>
                    <Field
                      data-test-id={`dropDown_${day}_endTime`}
                      className={styles.inlineBlock}
                      component="DropdownSelect"
                      options={timeOptions}
                      name="endTime"
                      disabled={isDisabled}
                      label="End Time"
                      search="label"
                    />
                  </Col>
                  {modal && (
                    <IconButton className={styles.icon} icon="cog" onClick={() => openModal(day)} />
                  )}
                  <Col xs={3} />
                </Row>
              </Grid>
            </Col>
          </Row>
        </Grid>
      </FormSection>
    );
  };

  DayHoursForm.propTypes = { day: PropTypes.string.isRequired };

  return (
    <Form
      enableReinitialize
      form={formName}
      onSubmit={formValues => onSubmit(hoursIndex, formValues)}
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

OfficeHoursForm.propTypes = {
  values: PropTypes.objectOf(
    PropTypes.shape({
      endTime: PropTypes.string,
      startTime: PropTypes.string,
      isClosed: PropTypes.bool,
    }),
  ),
  weeklySchedule: PropTypes.shape(weeklyScheduleShape),
  onSubmit: PropTypes.func.isRequired,
  dataId: PropTypes.string,
  formName: PropTypes.string.isRequired,
  modal: PropTypes.bool,
  openModal: PropTypes.func,
  hoursIndex: PropTypes.number,
  timezone: PropTypes.string.isRequired,
};

OfficeHoursForm.defaultProps = {
  values: {},
  weeklySchedule: null,
  modal: false,
  hoursIndex: 0,
  dataId: '',
  openModal: e => e,
};

function mapStateToProps({ form, auth }, { formName }) {
  // form data is populated when component renders
  const timezone = auth.get('timezone');

  return {
    values: !form[formName] ? {} : form[formName].values,
    timezone,
  };
}

export default connect(mapStateToProps, null)(OfficeHoursForm);
