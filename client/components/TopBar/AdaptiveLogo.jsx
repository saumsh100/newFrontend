import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from './reskin-styles.scss';
import EnabledFeature from '../library/EnabledFeature';

const AdaptiveLogo = ({ description, enterpriseManagementPhaseTwoActive }) => (
  <EnabledFeature
    drillProps={false}
    predicate={({ flags }) => flags.get('dcc-custom-sidebar')}
    render={
      <div
        className={classNames(styles.logoWrapperButton, {
          [styles.logoWrapperButton_emAccount]: enterpriseManagementPhaseTwoActive,
        })}
      >
        <div className={styles.logoImage}>
          <img
            className={styles.logoImageImage}
            src="/images/dentalcorp_logo.svg"
            alt={description}
          />
        </div>
      </div>
    }
    fallback={
      <div
        className={classNames(styles.logoWrapperButton, {
          [styles.logoWrapperButton_emAccount]: enterpriseManagementPhaseTwoActive,
        })}
      >
        <div className={styles.logoImage}>
          <img
            className={styles.logoImageImage}
            src="/images/carecru_logo_reskin.svg"
            alt={description}
          />
        </div>
      </div>
    }
  />
);

AdaptiveLogo.propTypes = {
  description: PropTypes.string.isRequired,
  enterpriseManagementPhaseTwoActive: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ featureFlags }) => ({
  enterpriseManagementPhaseTwoActive: featureFlags.getIn([
    'flags',
    'enterprise-management-phase-2',
  ]),
});

export default connect(mapStateToProps, null)(AdaptiveLogo);
