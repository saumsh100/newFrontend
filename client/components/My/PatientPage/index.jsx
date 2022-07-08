import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from '../../library';
import Section from './Shared/Section';
import PoweredByFooter from './Shared/PoweredByFooter';
import styles from './styles.scss';

/**
 * This component provides the structure for our static patient pages
 * ex.// Unsubscribe page, Confirmed Appointment page, Confirmed Email page, Reset-Password
 */
class PatientPage extends Component {
  componentDidMount() {
    const { bookingWidgetPrimaryColor } = this.props.params.account;
    document.documentElement.style.setProperty(
      '--primaryColor',
      bookingWidgetPrimaryColor || '#574BD2',
    );
    document.documentElement.style.setProperty(
      '--primaryButtonColor',
      bookingWidgetPrimaryColor || '#574BD2',
    );
  }

  render() {
    const { params, children } = this.props;
    const { account } = params;
    const { fullLogoUrl, bookingWidgetPrimaryColor, name } = account;

    return (
      <div className={styles.patientPage}>
        <Card
          style={{ borderTop: `5px solid ${bookingWidgetPrimaryColor}` }}
          className={styles.centerWrapper}
        >
          <div className={styles.patientPageConent}>
            {fullLogoUrl ? (
              <Section>
                <img
                  className={styles.logoClinic}
                  src={fullLogoUrl.replace('[size]', 'original')}
                  alt={`Logo for ${name}`}
                />
              </Section>
            ) : null}
            {children}
          </div>
          <PoweredByFooter />
        </Card>
      </div>
    );
  }
}

PatientPage.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.shape({
    account: PropTypes.shape({
      bookingWidgetPrimaryColor: PropTypes.string,
      fullLogoUrl: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default PatientPage;
