
import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import moment from 'moment';
import includes from 'lodash/includes';
import { bindActionCreators } from 'redux';
import { Button, Icon, Form, Field, Checkbox } from '../../library';
import WaitListPreferences from './WaitListPreferences';
import AvailabilitiesPreferences from './AvailabilitiesPreferences';
import AvailabilitiesDisplay from './AvailabilitiesDisplay';
import * as Actions from '../../../actions/availabilities';
import styles from './styles.scss';

class SelectionView extends Component {
  render() {
    const {
      services,
      practitioners,
      selectedServiceId,
      selectedPractitionerId,
      selectedStartDate,
      selectedAvailability,
      setRegistrationStep,
    } = this.props;

    let waitListPreferences = null;
    return (
      <div>
        <div className={styles.appointment__body_header}>
          <AvailabilitiesPreferences
            services={services}
            practitioners={practitioners}
            selectedServiceId={selectedServiceId}
            selectedPractitionerId={selectedPractitionerId}
            selectedStartDate={selectedStartDate}
          />
        </div>
        <AvailabilitiesDisplay />
        <div className={styles.appointment__footer}>
          {/*<div className={styles.appointment__footer_title}>
           BE NOTIFIED IF AN EARLIER TIME BECOMES AVAILABLE?
           </div>*/}
          {/* TODO: Remove Form, only need CheckBox component and ContinueButton */}
          {/*<div className={styles.appointment__footer_select}>
           <Checkbox
           id="yes"
           value="yes"
           checked={this.props.upperState.checked}
           onChange={this.props.handleChange}
           />
           </div>*/}
          {/*<Button
            icon="arrow-right"
            disabled={!selectedAvailability}
            className={styles.continueButton}
            onClick={(e) => {
              e.preventDefault();
              setRegistrationStep(2);
            }}
          >
            <span>Continue</span>
          </Button>*/}
          {/*waitListPreferences*/}
        </div>
      </div>
    );
  }
}

SelectionView.propTypes = {
  services: ImmutablePropTypes.map.isRequired,
  practitioners: ImmutablePropTypes.map.isRequired,
  selectedServiceId: PropTypes.string.isRequired,
  selectedPractitionerId: PropTypes.string,
  selectedStartDate: PropTypes.string.isRequired,
  selectedAvailability: PropTypes.object,
  setRegistrationStep: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, availabilities }) {
  return {
    services: entities.get('services'),
    practitioners: entities.get('practitioners'),
    selectedServiceId: availabilities.get('selectedServiceId'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
    selectedStartDate: availabilities.get('selectedStartDate'),
    selectedAvailability: availabilities.get('selectedAvailability'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setRegistrationStep: Actions.setRegistrationStepAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionView);

/*if (upperState.checked) {
 waitListPreferences = (
 <WaitListPreferences
 startsAt={startsAt}
 setRegistrationStep={props.setRegistrationStep}
 color={props.bookingWidgetPrimaryColor}
 />
 );
 }*/
