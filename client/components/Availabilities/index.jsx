
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { Button, Icon } from '../library';
import SelectionView from './SelectionView';
import SubmitView from './SubmitView';
import SideBar from './SideBar';
import Header from './Header';
import * as Actions from '../../actions/availabilities';
import styles from './styles.scss';

class Availabilities extends Component {
  componentWillReceiveProps() {
    const color = this.props.account.get('bookingWidgetPrimaryColor') || '#ff715a';
    document.body.style.setProperty('--bookingWidgetPrimaryColor', color);
  }

  render() {
    const {
      registrationStep,
      setRegistrationStep,
      selectedAvailability,
    } = this.props;

    let widgetBodyClasses = styles.widgetBody;
    let currentView = <SelectionView />;
    let footer = (
      <div className={styles.widgetStickyFooter}>
        <Button
          disabled={!selectedAvailability}
          onClick={() => setRegistrationStep(2)}
          className={styles.continueButton}
        >
          Continue
          <Icon
            className={styles.rightIcon}
            icon="arrow-right"
          />
        </Button>
      </div>
    );

    if (registrationStep === 2) {
      widgetBodyClasses = classNames(widgetBodyClasses, styles.widgetBodyNoFooter);
      currentView = <SubmitView />;
      footer = null;
    }


    return (
      <div className={styles.signup}>
        <div className={styles.signup__wrapper}>
          <SideBar />
          <div className={styles.appointment__main}>
            <Header />
            <div className={widgetBodyClasses}>
              {currentView}
            </div>
            {footer}
          </div>
        </div>
      </div>
    );
  }
}

Availabilities.propTypes = {
  selectedAvailability: PropTypes.object,
  registrationStep: PropTypes.number.isRequired,
  setRegistrationStep: PropTypes.func.isRequired,
};

function mapStateToProps({ availabilities }) {
  return {
    selectedAvailability: availabilities.get('selectedAvailability'),
    registrationStep: availabilities.get('registrationStep'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setRegistrationStep: Actions.setRegistrationStepAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Availabilities);
