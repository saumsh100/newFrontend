
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { submit } from 'redux-form';
import { Field, Form } from '../../../library';
import { historyShape } from '../../../library/PropTypeShapes/routerShapes';
import { setNotes } from '../../../../reducers/availabilities';
import {
  showButton,
  hideButton,
  setIsClicked,
  setText,
} from '../../../../reducers/widgetNavigation';
import { inputTextarea } from '../../theme';
import styles from './styles.scss';

class AdditionalInformation extends PureComponent {
  componentDidMount() {
    this.props.setText();
    this.props.showButton();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.floatingButtonIsClicked && this.props.floatingButtonIsClicked) {
      this.props.setIsClicked(false);
      this.props.hideButton();
      this.props.setText();
      return this.props.submit('additionalInformation');
    }

    return undefined;
  }

  render() {
    const {
      history: { push },
      notes,
      ...props
    } = this.props;
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
      <div className={styles.scrollableContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Additional Information</h1>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <Form
              form="additionalInformation"
              initialValues={{ notes: notes || '' }}
              ignoreSaveButton
              onSubmit={handleNotesSubmit}
            >
              <Field
                component="TextArea"
                theme={inputTextarea(styles)}
                label="Notes"
                name="notes"
              />
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      hideButton,
      setIsClicked,
      setNotes,
      setText,
      showButton,
      submit,
    },
    dispatch,
  );
}
function mapStateToProps({ availabilities, widgetNavigation }) {
  return {
    notes: availabilities.get('notes'),
    floatingButtonIsClicked: widgetNavigation.getIn(['floatingButton', 'isClicked']),
  };
}

AdditionalInformation.propTypes = {
  floatingButtonIsClicked: PropTypes.bool.isRequired,
  hideButton: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  notes: PropTypes.string,
  setIsClicked: PropTypes.func.isRequired,
  setNotes: PropTypes.func.isRequired,
  setText: PropTypes.func.isRequired,
  showButton: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};

AdditionalInformation.defaultProps = {
  notes: '',
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AdditionalInformation),
);
