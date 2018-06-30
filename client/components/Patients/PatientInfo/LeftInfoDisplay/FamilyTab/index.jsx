
import React from 'react';
import { PropTypes } from 'prop-types';
import Family from '../../../Shared/Family';
import FamilyMember from '../../../Shared/FamilyMember';

const FamilyTab = ({ family }) => (
  <Family
    family={family}
    render={familyMembers => familyMembers.map(familyMember => <FamilyMember {...familyMember} />)}
  />
);

FamilyTab.propTypes = {
  family: PropTypes.shape({
    id: PropTypes.string,
    head: PropTypes.shape({
      accountId: PropTypes.string,
    }),
  }).isRequired,
};

export default FamilyTab;
