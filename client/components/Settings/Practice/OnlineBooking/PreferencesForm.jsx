import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, Icon } from '../../../library/index';
import Tooltip from '../../../Tooltip';
import AccountShape from '../../../library/PropTypeShapes/accountShape';
import EnabledFeature from '../../../library/EnabledFeature';
import styles from './styles.scss';

export default function PreferencesForm({ handleSubmit, activeAccount }) {
  const initialValues = {
    bookingWidgetPrimaryColor: activeAccount.get('bookingWidgetPrimaryColor') || '#FF715A',
    bookingWidgetButtonLabel: activeAccount.get('bookingWidgetButtonLabel') || 'Book Online',
  };
  const tooltipBody =
    'This is the label that will appear on the online booking widget button on your website.';
  const buttonLabelOptions = [
    {
      value: 'Book Online',
    },
    {
      value: 'Request Appointment',
    },
  ];

  return (
    <Form
      form="customizeWidget"
      onSubmit={handleSubmit}
      className={styles.preferencesForm}
      initialValues={initialValues}
      data-test-id="customizeWidgetForm"
      alignSave="left"
      enableReinitialize
    >
      <div className={styles.formContainer_pickerField}>
        <Field
          component="ColorPicker"
          label="Primary Widget Color"
          name="bookingWidgetPrimaryColor"
          data-test-id-child="colorInput"
          data-test-id="colorPicker"
        />
      </div>
      <EnabledFeature
        predicate={({ flags }) => flags.get('customizable-booking-widget-labels')}
        render={() => (
          <div className={styles.formContainer_widgetButtonLabel}>
            <span className={styles.labelTooltip}>
              <Tooltip body={tooltipBody} placement="right">
                <Icon icon="question-circle" />
              </Tooltip>
            </span>
            <Field
              name="bookingWidgetButtonLabel"
              label="Button Label"
              component="DropdownSelect"
              options={buttonLabelOptions}
              data-test-id="buttonLabel"
            />
          </div>
        )}
      />
    </Form>
  );
}

PreferencesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  activeAccount: PropTypes.shape(AccountShape).isRequired,
};
