
import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { Card } from '../../library';
import getParameterByName from './Shared/getParameterByName';
import Section from './Shared/Section';
import PoweredByFooter from './Shared/PoweredByFooter';
import styles from './styles.scss';

/**
 * This component provides the structure for our static patient pages
 * ex.// Unsubscribe page, Confirmed Appointment page, Confirmed Email page, Reset-Password
 */
class PatientPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { bookingWidgetPrimaryColor } = this.props.params.account;
    console.log(bookingWidgetPrimaryColor);
    document.documentElement.style.setProperty('--primaryColor', bookingWidgetPrimaryColor || '#ff715a');
    document.documentElement.style.setProperty('--primaryButtonColor', bookingWidgetPrimaryColor || '#ff715a');
  }

  render() {
    const {
      params,
      children,
    } = this.props;

    const { account } = params;
    const {
      fullLogoUrl,
      bookingWidgetPrimaryColor,
    } = account;

    return (
      <div className={styles.patientPage}>
        <Card style={{ borderTop: `5px solid ${bookingWidgetPrimaryColor}` }} className={styles.centerWrapper}>
          <Section>
            {fullLogoUrl ?
              <img
                className={styles.logoClinic}
                src={fullLogoUrl.replace('[size]', 'original')}
                alt={`Logo for ${account.name}`}
              /> : null}
          </Section>
          {children}
          <div className={styles.spaceFiller} />
          <PoweredByFooter />
        </Card>
      </div>
    );
  }
}

PatientPage.propTypes = {
  children: PropTypes.node,
};

export default PatientPage;
