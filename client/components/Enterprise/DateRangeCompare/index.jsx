
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.scss';
import {
  Form,
  FormSection,
  Field,
  Button,
  Grid,
  Row,
  Col,
} from '../../library';

export default function CompareRangeForm(props) {
  const { onSubmit, onClear, onCancel } = props;

  const initialValues = {
    from: {
      startDate: new Date(2017, 7, 1),
      endDate: new Date(2017, 7, 1),
    },

    compareTo: false,
  };

  return (
    <Form
      // className={styles.formDrop}
      // TODO: should probably make this a prop so that we can re-use on Intelligence page
      form="enterprise-range"
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id="enterprise-range"
      ignoreSaveButton
    >
      <Grid>
        <Row>Date Range</Row>
        <FormSection name="from">
          <Row className={styles.inputsWrapper}>
            <Col xs={5}>
              <Field
                required
                component="DayPicker"
                name="startDate"
                data-test-id="startDate"
              />
            </Col>
            <Col className={styles.dashCol} xs={2}>
              -
            </Col>
            <Col xs={5}>
              <Field
                required
                component="DayPicker"
                name="endDate"
                data-test-id="endDate"
              />
            </Col>
          </Row>
        </FormSection>
        <Row>
          <Field
            component="Checkbox"
            name="compareTo"
            label="Compare to"
            data-test-id="compareTo"
          />
        </Row>
        <FormSection name="to">
          <Row className={styles.inputsWrapper}>
            <Col xs={5}>
              <Field
                component="DayPicker"
                name="startDate"
                data-test-id="startDate"
              />
            </Col>
            <Col className={styles.dashCol} xs={2}>
              -
            </Col>
            <Col xs={5}>
              <Field
                component="DayPicker"
                name="endDate"
                data-test-id="endDate"
              />
            </Col>
          </Row>
        </FormSection>
        <Row>
          <div className={styles.buttons}>
            <Button flat type="button" onClick={onClear}>
              Clear
            </Button>
            <div className={styles.rightButtons}>
              <Button
                flat
                type="submit"
                className={styles.applyButton}
                // onClick={onSubmit}
              >
                Apply
              </Button>
              <Button flat type="button" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </Row>
      </Grid>
    </Form>
  );
}

CompareRangeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  onCancel: PropTypes.func,
};
