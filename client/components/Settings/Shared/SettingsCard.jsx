
import React from 'react';
import PropTypes from 'prop-types';
import { SContainer, SHeader, SBody, Header } from '../../library';
import styles from './settings-card.scss';

export default function SettingsCard({ title, actions, children, bodyClass }) {
  return (
    <SContainer>
      <SHeader className={styles.headerWrapper}>
        <Header title={title} />
      </SHeader>
      <SBody className={bodyClass}>
        {children}
      </SBody>
    </SContainer>
  );
}

SettingsCard.propTypes = {
  title: PropTypes.string.isRequired,
};
