
import React from 'react';
import PropTypes from 'prop-types';
import Section from '../Shared/Section';
import { Button } from '../../../library';
import styles from './styles.scss';
import accountShape from '../../../library/PropTypeShapes/accountShape';

const getWebsite = (website) => {
  const rx = new RegExp('^https?://');
  return rx.test(website) ? website : `http://${website}`;
};

const ConfirmedEmail = ({ params: { account } }) => (
    <div>
      <Section>
        <div className={styles.header}>Email is confirmed.</div>
        <div className={styles.text}>
          Thank you, we have confirmed your email. To go back to the clinic
          website, click on the button below.
        </div>
      </Section>
      <Section>
        <a href={`${getWebsite(account.website)}?cc=book`}>
          <Button
            icon="arrow-right"
            title="Back to Clinic Website"
            className={styles.backToLoginButton}
          />
        </a>
      </Section>
    </div>
);

export default ConfirmedEmail;

ConfirmedEmail.propTypes = {
  params: PropTypes.shape({
    account: PropTypes.shape(accountShape),
  }).isRequired,
};
