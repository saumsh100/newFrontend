
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Field, Form } from '../../../library';
import styles from './styles.scss';

function AdditionalInformation() {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h3 className={styles.title}>Additional Information</h3>
          <p className={styles.subtitle}>
            Add family members and leave any necessary notes for the practice.
          </p>
          <Form
            form="additionalInformation"
            ignoreSaveButton
            onSubmit={values => console.log(values)}
          >
            <Field
              component="TextArea"
              theme={{
                inputWithIcon: styles.inputWithIcon,
                iconClassName: styles.validationIcon,
                erroredLabelFilled: styles.erroredLabelFilled,
                input: styles.textarea,
                filled: styles.filled,
                label: styles.label,
                group: styles.group,
                error: styles.error,
                erroredInput: styles.erroredInput,
                bar: styles.bar,
                erroredLabel: styles.erroredLabel,
              }}
              label="Notes"
              name="notes"
            />
            <Button type="submit" className={styles.actionButton}>
              Next
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(connect(null, null)(AdditionalInformation));
