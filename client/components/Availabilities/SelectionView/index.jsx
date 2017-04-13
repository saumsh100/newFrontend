
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import includes from 'lodash/includes';
import { Button, Form, Field, Checkbox } from '../../library';
import WaitListPreferences from './WaitListPreferences';
import AvailabilitiesPreferencesForm from './AvailabilitiesPreferencesForm';
import AvailabilitiesDisplay from './AvailabilitiesDisplay';
import styles from './styles.scss';

export default class SelectionView extends Component {
  render() {
    const { practitionerId, services, availabilities, practitioners, defaultValues } = this.props.params;
    const { props, upperState } = this.props;

    const startsAt = props.practitionersStartEndDate.get('startsAt');

    let waitListPreferences = null;
    if (upperState.checked) {
      waitListPreferences = (
        <WaitListPreferences
          startsAt={startsAt}
          setRegistrationStep={props.setRegistrationStep}
          color={props.bookingWidgetPrimaryColor}
        />
      );
    }

    const { logo, address, clinicName } = props;
    return (
      <div className={styles.appointment}>
        <div className={styles.appointment__wrapper}>
          <div className={`${styles.appointment__sidebar} ${this.props.upperState.collapseMenu ? styles.appointment__sidebarActive : ''}`} >
            <div className={styles.sidebar__header}>
              <img className={styles.sidebar__header_logo} src={logo} alt="logo" />
              <div className={styles.sidebar__header_title}>
                Pacific Heart
                <span>Dental</span>
              </div>
            </div>
            <div className={styles.sidebar__body}>
              <div className={styles.sidebar__body_address}>
                <div className={styles.sidebar__address}>
                  <div className={styles.sidebar__address_title}>
                    {clinicName}
                  </div>
                  <div className={styles.sidebar__address_text}>
                    {address}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.sidebar__footer}>
              <div className={styles.sidebar__footer_copy}>
                <div>POWERED BY:</div>
                <img src="/images/logo_black.png" alt="logo" />
              </div>
            </div>
          </div>
          <div className={styles.appointment__main} >
            <div className={styles.appointment__header}>
              <button
                className={styles.appointment__header_btn}
                onClick={() => this.props.collapseMenu(true)}
              >
                <i className="fa fa-bars" />
              </button>
              <div className={styles.appointment__header_title}>
                BOOK APPOINTMENT
              </div>
              <button
                className={styles.appointment__header_btn}
                onClick={this.closeIframe}
              >
                <i className="fa fa-times" />
              </button>
            </div>
            <div onClick={() => this.props.collapseMenu(false)} className={styles.appointment__body}>
              <div className={styles.appointment__body_header}>
                <AvailabilitiesPreferencesForm
                  services={services}
                  practitioners={practitioners}
                  onChange={values => alert(JSON.stringify(values))}
                />
                {/*<div className={styles.appointment__select_title}>Practitioner</div>
                {defaultValues && defaultValues.practitionerId &&
                <Form
                  className={styles.appointment__select_wrapper} form="availabilities"
                  initialValues={defaultValues}
                >
                  <Field
                    component="Select"
                    name="practitionerId"
                    label="Select Practitioner"
                    min
                    className={styles.appointment__select_item}
                  >
                    {practitioners.map(p =>
                      <option value={p.id} key={p.id}>{p.getFullName()}</option>
                    )}
                  </Field>

                  <Field
                    component="Select"
                    className={styles.appointment__select_item}
                    name="serviceId"
                    label="Select Service"
                    min
                  >
                    {services.filter(s =>
                      includes(s.allowedPractitioners, practitionerId)
                    ).map(s =>
                      <option value={s.id} key={s.id}>{s.name}</option>
                    )}
                  </Field>
                </Form>}*/}
                <div className={styles.appointment__daypicker}>
                  <div className={styles.appointment__daypicker_title}>Appointment scheduler</div>
                  <div
                    onClick={this.openModal}
                    className={styles.appointment__daypicker_icon}
                  >
                    <i className="fa fa-calendar" />
                  </div>
                  {this.props.upperState.modalIsOpen ?
                    (
                      <div onClick={this.openModal} className={styles.appointment__daypicker_modal}>
                        <DayPicker
                          className={styles.appointment__daypicker_select}
                          onDayClick={this.handleDayClick}
                          selectedDays={this.isDaySelected}
                        />
                      </div>
                    ) : null
                  }
                </div>
              </div>
              <AvailabilitiesDisplay
                startsAt={startsAt}
                onSelect={this.props.selectAvailability}
                onSixDaysBack={this.props.sixDaysBack}
                onSixDaysForward={this.props.sixDaysForward}
                availabilities={availabilities}
              />
              <div className={styles.appointment__footer}>
                <div className={styles.appointment__footer_wrapper}>
                  <div className={styles.appointment__footer_title}>
                    BE NOTIFIED IF AN EARLIER TIME BECOMES AVAILABLE?
                  </div>
                  {/* TODO: Remove Form, only need CheckBox component and ContinueButton */}
                  <form className={styles.appointment__footer_confirm}>
                    <div className={styles.appointment__footer_select}>
                      <Checkbox
                        id="yes"
                        value="yes"
                        checked={this.props.upperState.checked}
                        onChange={this.props.handleChange}
                      />
                    </div>
                    <button
                      disabled={!startsAt }
                      onClick={this.props.handleSaveClick}
                      className={this.props.upperState.checked ? styles.appointment__footer_btndisabled : styles.appointment__footer_btn}
                      type="submit"
                    >Continue</button>
                  </form>
                </div>
                {waitListPreferences}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
