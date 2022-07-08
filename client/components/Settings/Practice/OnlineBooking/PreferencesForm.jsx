import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, Icon } from '../../../library/index';
import Tooltip from '../../../Tooltip';
import AccountShape from '../../../library/PropTypeShapes/accountShape';
import EnabledFeature from '../../../library/EnabledFeature';
import styles from './styles.scss';

export default function PreferencesForm({ role, handleSubmit, activeAccount }) {
  const initialValues = {
    bookingWidgetPrimaryColor: activeAccount.get('bookingWidgetPrimaryColor') || '#574BD2',
    bookingWidgetButtonLabel: activeAccount.get('bookingWidgetButtonLabel') || 'Book Online',
  };
  const isRoleNotSuperOrOwner = role !== 'SUPERADMIN' && role !== 'OWNER';
  const tooltipBody = isRoleNotSuperOrOwner
    ? 'This setting will change a set of labels across the online booking flow incl. the widget button label on your website. If you would like to update this, please contact your account owner or our support team.'
    : 'This setting will change a set of labels across the online booking flow incl. the widget button label on your website.';
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
              label="Widget Labels"
              component="DropdownSelect"
              options={buttonLabelOptions}
              data-test-id="buttonLabel"
              disabled={isRoleNotSuperOrOwner}
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
  role: PropTypes.string.isRequired,
};
