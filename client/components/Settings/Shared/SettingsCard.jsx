
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SContainer, SHeader, SBody, Header } from '../../library';
import styles from './settings-card.scss';

export default function SettingsCard(props) {
  const { title, rightActions, children, headerClass, bodyClass, subHeader, className } = props;

  const headerClasses = classNames(headerClass, styles.headerWrapper);

  return (
    <SContainer className={className}>
      <SHeader className={headerClasses}>
        <div className={styles.mainHeader}>
          <Header title={title} />
          {rightActions ? <div className={styles.pullRight}>{rightActions}</div> : null}
        </div>
        {subHeader ? <div className={styles.subHeader}>{subHeader}</div> : null}
      </SHeader>
      <SBody className={bodyClass}>{children}</SBody>
    </SContainer>
  );
}

SettingsCard.propTypes = {
  title: PropTypes.string.isRequired,
};
