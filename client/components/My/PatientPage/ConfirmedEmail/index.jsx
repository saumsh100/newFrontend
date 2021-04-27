
import React from 'react';
import PropTypes from 'prop-types';
import Section from '../Shared/Section';
import { Button } from '../../../library';
import styles from './styles.scss';
import { accountShape } from '../../../library/PropTypeShapes';

export default function ConfirmedEmail({ params }) {
  const { account } = params;
  return (
    <div>
      <Section>
        <div className={styles.header}>Email is confirmed.</div>
        <div className={styles.text}>
          Thank you, we have confirmed your email. To go back to the clinic website, click on the
          button below.
        </div>
      </Section>
      <Section>
        <a href={`${account.website}?cc=book`}>
          <Button
            // fluid
            icon="arrow-right"
            title="Back to Clinic Website"
            className={styles.backToLoginButton}
          />
        </a>
      </Section>
      <Section />
    </div>
  );
}

ConfirmedEmail.propTypes = {
  params: PropTypes.shape(accountShape).isRequired,
};
