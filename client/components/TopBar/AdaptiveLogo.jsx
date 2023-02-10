import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EnabledFeature from '../library/EnabledFeature';
import LogoButton from './LogoButton';

const AdaptiveLogo = ({ description, enterpriseManagementPhaseTwoActive, userRole }) => (
  <EnabledFeature
    drillProps={false}
    predicate={({ flags }) => flags.get('dcc-custom-sidebar')}
    render={
      <LogoButton
        description={description}
        enterpriseManagementPhaseTwoActive={enterpriseManagementPhaseTwoActive}
        imgSrc="/images/dentalcorp_logo.svg"
      />
    }
    fallback={
      <LogoButton
        description={description}
        enterpriseManagementPhaseTwoActive={enterpriseManagementPhaseTwoActive}
        imgSrc="/images/carecru_logo_reskin.svg"
        userRole={userRole}
      />
    }
  />
);

AdaptiveLogo.propTypes = {
  description: PropTypes.string.isRequired,
  enterpriseManagementPhaseTwoActive: PropTypes.bool.isRequired,
  userRole: PropTypes.string.isRequired,
};

const mapStateToProps = ({ featureFlags, auth }) => {
  const userRole = auth.get('role');

  const enterpriseManagementPhaseTwoActive =
    process.env.NODE_ENV === 'development'
      ? true
      : featureFlags.getIn(['flags', 'enterprise-management-phase-2']) || false;
  return {
    userRole,
    enterpriseManagementPhaseTwoActive,
  };
};

export default connect(mapStateToProps, null)(AdaptiveLogo);
