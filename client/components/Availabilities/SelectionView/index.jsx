
import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import moment from 'moment';
import includes from 'lodash/includes';
import { Button, Form, Field, Checkbox } from '../../library';
import WaitListPreferences from './WaitListPreferences';
import AvailabilitiesPreferencesForm from './AvailabilitiesPreferencesForm';
import AvailabilitiesDisplay from './AvailabilitiesDisplay';
import styles from './styles.scss';

class SelectionView extends Component {
  render() {
    const { practitionerId, availabilities, defaultValues } = this.props.params;
    const { props, upperState, services, practitioners } = this.props;

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
      <div className={styles.appointment__body}>
        <div className={styles.appointment__body_header}>
          <AvailabilitiesPreferencesForm
            services={services}
            practitioners={practitioners}
            onChange={values => alert(JSON.stringify(values))}
          />
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
    );
  }
}

SelectionView.propTypes = {
  services: ImmutablePropTypes.map.isRequired,
  practitioners: ImmutablePropTypes.map.isRequired,
};

function mapStateToProps({ entities }) {
  return {
    services: entities.get('services'),
    practitioners: entities.get('practitioners'),
  };
}

export default connect(mapStateToProps, null)(SelectionView);
