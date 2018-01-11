
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
                src={fullLogoUrl}
                alt="Logo"
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