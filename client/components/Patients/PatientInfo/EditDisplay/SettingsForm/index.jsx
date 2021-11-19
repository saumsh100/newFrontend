import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Map } from 'immutable';
import classNames from 'classnames';
import { convertIntervalToMs, intervalToNumType } from '../../../../library/util/datetime/helpers';
import OmitForm from '../OmitForm';
import { Grid, Row, Col, Form, Field, FormSection } from '../../../../library';
import { capitalizeText } from '../../../../Utils';
import { isResponsive } from '../../../../../util/hub';
import styles from '../styles.scss';

const sanitizeList = (list) =>
  list.filter((v) => v.isActive).sortBy((r) => -convertIntervalToMs(r.interval));

const singularType = {
  weeks: 'week',
  months: 'month',
};

const pluralType = {
  weeks: 'weeks',
  months: 'months',
};

const getTypeWord = (num, type) => {
  if (Math.abs(num) === 1) {
    return singularType[type];
  }
  return pluralType[type];
};

class SettingsForm extends Component {
  constructor(props) {
    super(props);

    const {
      patient: { preferences, omitReminderIds, omitRecallIds },
      recalls,
      reminders,
    } = props;

    this.state = {
      preferences,
      omitReminderIds: omitReminderIds.filter((id) => sanitizeList(reminders).get(id)),
      omitRecallIds: omitRecallIds.filter((id) => sanitizeList(recalls).get(id)),
    };

    this.omitFormHandler = this.omitFormHandler.bind(this);
  }

  getSettingType(key) {
    const sMap = {
      omitReminderIds: 'reminders',
      omitRecallIds: 'recalls',
    };

    return sMap[key] || sMap;
  }

  omitFormHandler(setting) {
    return (toOmit) => this.setState({ [setting]: toOmit });
  }

  render() {
    const { handleSubmit, patient, reminders, recalls } = this.props;
    const { omitReminderIds, omitRecallIds, preferences } = this.state;

    return (
      <Form
        form="Form4"
        onSubmit={(values) =>
          handleSubmit({
            ...values,
            ...this.state,
          })
        }
        onChange={(values) =>
          this.setState({
            preferences: values.preferences,
          })
        }
        className={styles.formContainer}
        initialValues={{ preferences }}
        ignoreSaveButton={!isResponsive()}
      >
        <FormSection name="preferences">
          <Grid className={styles.grid}>
            <div className={styles.topPadding}>&nbsp;</div>
            <div className={styles.settingsHeader}> Subscriptions </div>
            <Row className={styles.row}>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Special/Holiday Messages</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="birthdayMessage" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Newsletter</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="newsletter" />
                  </div>
                </div>
              </Col>
            </Row>
            <div className={styles.settingsHeader}> Services </div>
            <Row className={styles.row}>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Appointment Reminders</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="reminders" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={classNames(styles.colToggle, styles.omitFormWrapper)}>
                <OmitForm
                  disabled={!preferences.reminders}
                  formName={`omitReminderIds_${patient.id}`}
                  value={omitReminderIds}
                  toggles={sanitizeList(reminders).toArray()}
                  onChange={this.omitFormHandler('omitReminderIds')}
                  renderToggles={({ toggleComponent, toggleProps }) => {
                    const contactTypes = toggleProps.primaryTypes;
                    const checkContactTypes = Array.isArray(contactTypes)
                      ? contactTypes
                      : contactTypes.toJS();
                    checkContactTypes
                      .map((contactType) => (contactType === 'phone' ? 'voice' : contactType))
                      .join(', ');
                    const touchpointMessageType = toggleProps.isConfirmable
                      ? 'Confirmable'
                      : 'Friendly';
                    const touchpointType = toggleProps.isWaitingRoomEnabled
                      ? 'Waiting Room'
                      : touchpointMessageType;
                    const remindersText = `${toggleProps.interval} ${touchpointType}`;
                    const text = `${remindersText} reminder (${checkContactTypes})`;
                    return (
                      <div className={styles.omitToggleWrapper}>
                        {toggleComponent({
                          label: capitalizeText(text),
                          name: toggleProps.id,
                        })}
                      </div>
                    );
                  }}
                />
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Patient Recalls</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="recalls" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={classNames(styles.colToggle, styles.omitFormWrapper)}>
                <OmitForm
                  disabled={!preferences.recalls}
                  formName={`omitRecallIds_${patient.id}`}
                  value={omitRecallIds}
                  toggles={sanitizeList(recalls).toArray()}
                  onChange={this.omitFormHandler('omitRecallIds')}
                  renderToggles={({ toggleComponent, toggleProps }) => {
                    const { num, type } = intervalToNumType(toggleProps.interval);
                    const text = `${Math.abs(num)} ${getTypeWord(num, type)} ${
                      num >= 0 ? 'before' : 'after'
                    } due date`;

                    return (
                      <div className={styles.omitToggleWrapper}>
                        {toggleComponent({
                          label: capitalizeText(text),
                          name: toggleProps.id,
                        })}
                      </div>
                    );
                  }}
                />
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Review Requests</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="reviews" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Referral Requests</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="referrals" />
                  </div>
                </div>
              </Col>
            </Row>
            <div className={styles.settingsHeader}> Contact Methods </div>
            <Row className={styles.row}>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Email</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="emailNotifications" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>SMS</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="sms" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Phone</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="phone" />
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>
        </FormSection>
      </Form>
    );
  }
}

const selector = formValueSelector('Form4');

const mapStateToProps = (state) => ({
  remindersField: selector(state, 'preferences.reminders'),
  recallsField: selector(state, 'preferences.recalls'),
});

SettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  patient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    preferences: PropTypes.objectOf(PropTypes.bool),
    omitReminderIds: PropTypes.arrayOf(PropTypes.bool),
    omitRecallIds: PropTypes.arrayOf(PropTypes.bool),
  }).isRequired,
  reminders: PropTypes.instanceOf(Map).isRequired,
  recalls: PropTypes.instanceOf(Map).isRequired,
  // Those props are not being called by their name so they throw this lint error
  remindersField: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  recallsField: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
};

SettingsForm.defaultProps = {
  remindersField: null,
  recallsField: null,
};

export default connect(mapStateToProps)(SettingsForm);
