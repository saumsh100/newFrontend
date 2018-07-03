
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Button, Field, Form } from '../../../library';
import { historyShape } from '../../../library/PropTypeShapes/routerShapes';
import { setNotes } from '../../../../actions/availabilities';
import styles from './styles.scss';

function AdditionalInformation({ history: { push }, notes, ...props }) {
  /**
   * Set the notes and send the user to the review's page.
   *
   * @param {string} notes
   */
  const handleNotesSubmit = (values) => {
    props.setNotes(values.notes);
    return push('./review');
  };

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
            initialValues={{ notes: notes || '' }}
            ignoreSaveButton
            onSubmit={handleNotesSubmit}
          >
            <Field
              component="TextArea"
              theme={{
                bar: styles.bar,
                error: styles.error,
                erroredInput: styles.erroredInput,
                erroredLabel: styles.erroredLabel,
                erroredLabelFilled: styles.erroredLabelFilled,
                filled: styles.filled,
                group: styles.group,
                iconClassName: styles.validationIcon,
                input: styles.textarea,
                inputWithIcon: styles.inputWithIcon,
                label: styles.label,
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setNotes,
    },
    dispatch,
  );
}
function mapStateToProps({ availabilities }) {
  return {
    notes: availabilities.get('notes'),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdditionalInformation));

AdditionalInformation.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  notes: PropTypes.string,
  setNotes: PropTypes.func.isRequired,
};
AdditionalInformation.defaultProps = {
  notes: '',
};
