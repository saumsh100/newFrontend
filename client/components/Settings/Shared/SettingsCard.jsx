
import React from 'react';
import PropTypes from 'prop-types';
import { SContainer, SHeader, SBody, Header } from '../../library';
import styles from './settings-card.scss';

export default function SettingsCard(props) {
  const {
    title,
    rightActions,
    children,
    bodyClass,
  } = props;

  return (
    <SContainer>
      <SHeader className={styles.headerWrapper}>
        <Header title={title} />
        <div className={styles.pullRight}>
          {rightActions}
        </div>
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
